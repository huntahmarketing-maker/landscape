/*
# Fix search_path for all admin SECURITY DEFINER functions

1. Changes
- Recreate every admin function with `SET search_path = public, extensions` so that
  pgcrypto functions (crypt, gen_salt, gen_random_bytes) resolve correctly at runtime.
- Recreate admin_generate_token as SECURITY DEFINER with the same search_path.

2. Security
- No behavioral changes. All functions still validate the session token internally
  before performing any privileged operation.
*/

CREATE OR REPLACE FUNCTION admin_generate_token()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT encode(gen_random_bytes(64), 'hex');
$$;

REVOKE EXECUTE ON FUNCTION admin_generate_token FROM public;
GRANT EXECUTE ON FUNCTION admin_generate_token TO anon, authenticated;

CREATE OR REPLACE FUNCTION admin_register(p_username text, p_password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
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

CREATE OR REPLACE FUNCTION admin_login(p_username text, p_password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
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

CREATE OR REPLACE FUNCTION admin_verify_session(p_token text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
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

  UPDATE admin_sessions SET expires_at = now() + interval '24 hours'
  WHERE token = p_token;

  RETURN v_username;
END;
$$;

CREATE OR REPLACE FUNCTION admin_logout(p_token text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  DELETE FROM admin_sessions WHERE token = p_token;
END;
$$;

CREATE OR REPLACE FUNCTION admin_exists()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT exists(SELECT 1 FROM admin_credentials);
$$;

CREATE OR REPLACE FUNCTION admin_list_appointments(p_token text)
RETURNS SETOF appointments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
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
SET search_path = public, extensions
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
SET search_path = public, extensions
AS $$
BEGIN
  IF admin_verify_session(p_token) IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  DELETE FROM appointments WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION admin_list_inquiries(p_token text)
RETURNS SETOF inquiries
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
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
SET search_path = public, extensions
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
SET search_path = public, extensions
AS $$
BEGIN
  IF admin_verify_session(p_token) IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  DELETE FROM inquiries WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION admin_list_quote_requests(p_token text)
RETURNS SETOF quote_requests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
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
SET search_path = public, extensions
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
SET search_path = public, extensions
AS $$
BEGIN
  IF admin_verify_session(p_token) IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  DELETE FROM quote_requests WHERE id = p_id;
END;
$$;

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
GRANT EXECUTE ON FUNCTION admin_generate_token TO anon, authenticated;
