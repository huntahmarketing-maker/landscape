/*
# Switch admin portal to self-provisioning username/password auth

1. New Tables
- `admin_credentials`: stores a single admin username and a bcrypt-hashed password.
  Only one row is ever allowed; the first credentials entered on /admin create it.
  The plaintext password is NEVER stored.
- `admin_sessions`: stores opaque session tokens (128-byte hex) used to authenticate
  dashboard requests. Sessions expire after 24 hours.

2. New Functions (all SECURITY DEFINER, SET search_path = public)
- `admin_register(p_username, p_password)`: If no admin exists yet, create the first
  admin with a bcrypt hash. Returns a session token. If an admin already exists,
  raises an exception.
- `admin_login(p_username, p_password)`: Verifies credentials with bcrypt and issues
  a new 24-hour session token.
- `admin_verify_session(p_token)`: Returns the admin username if the token is valid
  and not expired, otherwise NULL. Extends the session by 24 hours on each valid call.
- `admin_logout(p_token)`: Deletes the session row.
- `admin_list_appointments()`: Returns all appointment rows.
- `admin_update_appointment(p_id, p_status, p_admin_notes)`: Updates status and/or notes.
- `admin_delete_appointment(p_id)`: Deletes an appointment.
- `admin_list_inquiries()`: Returns all inquiry rows.
- `admin_update_inquiry(p_id, p_status, p_admin_notes)`: Updates status and/or notes.
- `admin_delete_inquiry(p_id)`: Deletes an inquiry.
- `admin_list_quote_requests()`: Returns all quote request rows.
- `admin_update_quote_request(p_id, p_status, p_admin_notes)`: Updates status and/or notes.
- `admin_delete_quote_request(p_id)`: Deletes a quote request.

3. Security
- All admin_read/admin_write functions check `admin_verify_session` internally and
  raise an exception if the caller is not authenticated. The caller cannot forge
  the session — the token is passed as a parameter and validated against the table.
- RLS remains enabled on appointments/inquiries/quote_requests. The anon role can
  only INSERT new rows with status='New' and empty admin_notes. All SELECT/UPDATE/
  DELETE goes through the SECURITY DEFINER functions which run as the table owner.
- `admin_credentials` and `admin_sessions` have RLS enabled with deny-all policies
  for anon/authenticated — they are only accessible through the SECURITY DEFINER
  functions.
- EXECUTE on every admin function is revoked from anon and granted only to
  authenticated and anon (needed because the browser uses the anon key to call
  RPCs). The functions themselves enforce auth by validating the session token.

4. Important Notes
- bcrypt is available through the pgcrypto extension.
- The old `admins` table (which referenced auth.users) is no longer used. It is
  not dropped to avoid data loss, but RLS is tightened to deny all access.
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admin_credentials (
  id integer PRIMARY KEY DEFAULT 1,
  username text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admin_credentials_single_row CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "deny_all_admin_credentials" ON admin_credentials;
CREATE POLICY "deny_all_admin_credentials" ON admin_credentials
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "deny_all_admin_sessions" ON admin_sessions;
CREATE POLICY "deny_all_admin_sessions" ON admin_sessions
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

-- Tighten old admins table: deny all (no longer used)
DROP POLICY IF EXISTS "Admins can view own admin record" ON admins;
CREATE POLICY "Admins can view own admin record" ON admins
  FOR SELECT TO authenticated USING (false);

-- Helper: generate a random 128-char hex token
CREATE OR REPLACE FUNCTION admin_generate_token()
RETURNS text
LANGUAGE sql
AS $$
  SELECT encode(gen_random_bytes(64), 'hex');
$$;

-- Register: only works if no admin exists yet
CREATE OR REPLACE FUNCTION admin_register(p_username text, p_password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_count integer;
  v_token text;
BEGIN
  SELECT count(*) INTO v_existing_count FROM admin_credentials;
  IF v_existing_count > 0 THEN
    RAISE EXCEPTION 'An admin account already exists';
  END IF;

  IF length(p_username) < 3 OR length(p_username) > 50 THEN
    RAISE EXCEPTION 'Username must be 3–50 characters';
  END IF;
  IF length(p_password) < 8 THEN
    RAISE EXCEPTION 'Password must be at least 8 characters';
  END IF;

  INSERT INTO admin_credentials (id, username, password_hash)
  VALUES (1, p_username, crypt(p_password, gen_salt('bf', 10)));

  v_token := admin_generate_token();
  INSERT INTO admin_sessions (token, expires_at)
  VALUES (v_token, now() + interval '24 hours');

  RETURN v_token;
END;
$$;

-- Login: verify credentials and issue session
CREATE OR REPLACE FUNCTION admin_login(p_username text, p_password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_creds admin_credentials%ROWTYPE;
  v_token text;
BEGIN
  SELECT * INTO v_creds FROM admin_credentials WHERE id = 1;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No admin account exists';
  END IF;

  IF v_creds.username <> p_username OR v_creds.password_hash <> crypt(p_password, v_creds.password_hash) THEN
    RAISE EXCEPTION 'Invalid credentials';
  END IF;

  v_token := admin_generate_token();
  INSERT INTO admin_sessions (token, expires_at)
  VALUES (v_token, now() + interval '24 hours');

  RETURN v_token;
END;
$$;

-- Verify session: returns username or NULL
CREATE OR REPLACE FUNCTION admin_verify_session(p_token text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username text;
BEGIN
  SELECT c.username INTO v_username
  FROM admin_sessions s
  JOIN admin_credentials c ON c.id = 1
  WHERE s.token = p_token AND s.expires_at > now();

  IF v_username IS NULL THEN
    RETURN NULL;
  END IF;

  -- Extend session
  UPDATE admin_sessions SET expires_at = now() + interval '24 hours'
  WHERE token = p_token;

  RETURN v_username;
END;
$$;

-- Logout
CREATE OR REPLACE FUNCTION admin_logout(p_token text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM admin_sessions WHERE token = p_token;
END;
$$;

-- Check if any admin exists (public, so the login page can show register vs login)
CREATE OR REPLACE FUNCTION admin_exists()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT exists(SELECT 1 FROM admin_credentials);
$$;

-- Appointments
CREATE OR REPLACE FUNCTION admin_list_appointments(p_token text)
RETURNS SETOF appointments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF admin_verify_session(p_token) IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  RETURN QUERY SELECT * FROM appointments ORDER BY submitted_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION admin_update_appointment(p_token text, p_id uuid, p_status text, p_admin_notes text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF admin_verify_session(p_token) IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  UPDATE appointments
  SET status = COALESCE(NULLIF(p_status, ''), status),
      admin_notes = COALESCE(NULLIF(p_admin_notes, ''), admin_notes)
  WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION admin_delete_appointment(p_token text, p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF admin_verify_session(p_token) IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  DELETE FROM appointments WHERE id = p_id;
END;
$$;

-- Inquiries
CREATE OR REPLACE FUNCTION admin_list_inquiries(p_token text)
RETURNS SETOF inquiries
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF admin_verify_session(p_token) IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  RETURN QUERY SELECT * FROM inquiries ORDER BY submitted_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION admin_update_inquiry(p_token text, p_id uuid, p_status text, p_admin_notes text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF admin_verify_session(p_token) IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  UPDATE inquiries
  SET status = COALESCE(NULLIF(p_status, ''), status),
      admin_notes = COALESCE(NULLIF(p_admin_notes, ''), admin_notes)
  WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION admin_delete_inquiry(p_token text, p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF admin_verify_session(p_token) IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  DELETE FROM inquiries WHERE id = p_id;
END;
$$;

-- Quote Requests
CREATE OR REPLACE FUNCTION admin_list_quote_requests(p_token text)
RETURNS SETOF quote_requests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF admin_verify_session(p_token) IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  RETURN QUERY SELECT * FROM quote_requests ORDER BY submitted_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION admin_update_quote_request(p_token text, p_id uuid, p_status text, p_admin_notes text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF admin_verify_session(p_token) IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  UPDATE quote_requests
  SET status = COALESCE(NULLIF(p_status, ''), status),
      admin_notes = COALESCE(NULLIF(p_admin_notes, ''), admin_notes)
  WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION admin_delete_quote_request(p_token text, p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF admin_verify_session(p_token) IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  DELETE FROM quote_requests WHERE id = p_id;
END;
$$;

-- Grant EXECUTE to anon (browser uses anon key; functions self-protect via token)
REVOKE EXECUTE ON FUNCTION admin_register FROM public;
REVOKE EXECUTE ON FUNCTION admin_login FROM public;
REVOKE EXECUTE ON FUNCTION admin_verify_session FROM public;
REVOKE EXECUTE ON FUNCTION admin_logout FROM public;
REVOKE EXECUTE ON FUNCTION admin_exists FROM public;
REVOKE EXECUTE ON FUNCTION admin_list_appointments FROM public;
REVOKE EXECUTE ON FUNCTION admin_update_appointment FROM public;
REVOKE EXECUTE ON FUNCTION admin_delete_appointment FROM public;
REVOKE EXECUTE ON FUNCTION admin_list_inquiries FROM public;
REVOKE EXECUTE ON FUNCTION admin_update_inquiry FROM public;
REVOKE EXECUTE ON FUNCTION admin_delete_inquiry FROM public;
REVOKE EXECUTE ON FUNCTION admin_list_quote_requests FROM public;
REVOKE EXECUTE ON FUNCTION admin_update_quote_request FROM public;
REVOKE EXECUTE ON FUNCTION admin_delete_quote_request FROM public;
REVOKE EXECUTE ON FUNCTION admin_generate_token FROM public;

GRANT EXECUTE ON FUNCTION admin_register TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_login TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_verify_session TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_logout TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_exists TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_list_appointments TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_update_appointment TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_appointment TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_list_inquiries TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_update_inquiry TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_inquiry TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_list_quote_requests TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_update_quote_request TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_quote_request TO anon, authenticated;
