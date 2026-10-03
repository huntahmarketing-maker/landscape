/*
# Create DMA Landscaping admin portal data model

1. New Tables
- `admins`: allowlist of Supabase Auth users who may enter the private dashboard.
- `appointments`: customer booking requests with requested date/time, status, and private admin notes.
- `inquiries`: customer chat/contact messages with status and private admin notes.
- `quote_requests`: customer quote requests with project information, status, and private admin notes.

2. Security
- Row level security is enabled on every new table.
- Public visitors may insert only their own appointment, inquiry, or quote request.
- Only authenticated users listed in `admins` may read, update, or delete customer records.
- Admin-only fields such as status and internal notes are never writable by anonymous visitors.

3. Important Notes
- Admin authentication uses Supabase Auth email/password sessions; passwords are never stored in these tables.
- The first administrator must be created in Supabase Auth and then added to `admins` by an operator with database access.
- The existing public website remains single-business and does not expose an admin link.
*/

CREATE TABLE IF NOT EXISTS admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  service text NOT NULL,
  appointment_date date,
  appointment_time text,
  notes text NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Confirmed', 'Completed', 'Cancelled')),
  admin_notes text NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  message text NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Closed')),
  admin_notes text NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL DEFAULT '',
  service text NOT NULL,
  project_details text NOT NULL,
  message text NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Estimate Scheduled', 'Quote Sent', 'Won', 'Lost')),
  admin_notes text NOT NULL DEFAULT ''
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view own admin record" ON admins;
CREATE POLICY "Admins can view own admin record" ON admins FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Public cannot insert admin records" ON admins;
CREATE POLICY "Public cannot insert admin records" ON admins FOR INSERT TO anon, authenticated WITH CHECK (false);
DROP POLICY IF EXISTS "Public cannot update admin records" ON admins;
CREATE POLICY "Public cannot update admin records" ON admins FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS "Public cannot delete admin records" ON admins;
CREATE POLICY "Public cannot delete admin records" ON admins FOR DELETE TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "Public can submit appointments" ON appointments;
CREATE POLICY "Public can submit appointments" ON appointments FOR INSERT TO anon, authenticated WITH CHECK (status = 'New' AND admin_notes = '');
DROP POLICY IF EXISTS "Admins can view appointments" ON appointments;
CREATE POLICY "Admins can view appointments" ON appointments FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can update appointments" ON appointments;
CREATE POLICY "Admins can update appointments" ON appointments FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can delete appointments" ON appointments;
CREATE POLICY "Admins can delete appointments" ON appointments FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

DROP POLICY IF EXISTS "Public can submit inquiries" ON inquiries;
CREATE POLICY "Public can submit inquiries" ON inquiries FOR INSERT TO anon, authenticated WITH CHECK (status = 'New' AND admin_notes = '');
DROP POLICY IF EXISTS "Admins can view inquiries" ON inquiries;
CREATE POLICY "Admins can view inquiries" ON inquiries FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can update inquiries" ON inquiries;
CREATE POLICY "Admins can update inquiries" ON inquiries FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can delete inquiries" ON inquiries;
CREATE POLICY "Admins can delete inquiries" ON inquiries FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

DROP POLICY IF EXISTS "Public can submit quote requests" ON quote_requests;
CREATE POLICY "Public can submit quote requests" ON quote_requests FOR INSERT TO anon, authenticated WITH CHECK (status = 'New' AND admin_notes = '');
DROP POLICY IF EXISTS "Admins can view quote requests" ON quote_requests;
CREATE POLICY "Admins can view quote requests" ON quote_requests FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can update quote requests" ON quote_requests;
CREATE POLICY "Admins can update quote requests" ON quote_requests FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can delete quote requests" ON quote_requests;
CREATE POLICY "Admins can delete quote requests" ON quote_requests FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS appointments_submitted_at_idx ON appointments (submitted_at DESC);
CREATE INDEX IF NOT EXISTS appointments_date_idx ON appointments (appointment_date);
CREATE INDEX IF NOT EXISTS inquiries_submitted_at_idx ON inquiries (submitted_at DESC);
CREATE INDEX IF NOT EXISTS quote_requests_submitted_at_idx ON quote_requests (submitted_at DESC);
