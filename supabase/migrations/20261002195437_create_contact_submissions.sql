/*
# Create contact_submissions table (single-tenant, no auth)

1. New Tables
- `contact_submissions`
  - `id` (uuid, primary key)
  - `name` (text, not null) — submitter's full name
  - `email` (text, not null) — submitter's email address
  - `phone` (text, — submitter's phone number
  - `service` (text, — which service they're interested in
  - `message` (text, — the message/inquiry text
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `contact_submissions`.
- Allow anon + authenticated INSERT only (public contact form).
- No SELECT/UPDATE/DELETE for anon — submissions are private to the business owner.
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  service text,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_submissions" ON contact_submissions;
CREATE POLICY "anon_insert_contact_submissions"
ON contact_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_select_contact_submissions" ON contact_submissions;
CREATE POLICY "authenticated_select_contact_submissions"
ON contact_submissions FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "authenticated_update_contact_submissions" ON contact_submissions;
CREATE POLICY "authenticated_update_contact_submissions"
ON contact_submissions FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_contact_submissions" ON contact_submissions;
CREATE POLICY "authenticated_delete_contact_submissions"
ON contact_submissions FOR DELETE
TO authenticated
USING (true);
