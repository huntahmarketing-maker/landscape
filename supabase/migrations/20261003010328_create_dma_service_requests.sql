/*
# Create DMA Landscaping service request capture

1. New Tables
- `dma_service_requests`
- `id` (uuid, primary key): unique request identifier.
- `request_type` (text): booking, quote, or chat.
- `name` (text): customer's name.
- `email` (text): customer's email address.
- `phone` (text): customer's phone number.
- `address` (text): service location for bookings and quotes.
- `service` (text): selected landscaping service.
- `preferred_date` (date): requested appointment date when provided.
- `time_window` (text): requested appointment window when provided.
- `details` (text): project notes or chat message.
- `created_at` (timestamptz): submission timestamp.
2. Security
- Row level security is enabled.
- Anonymous and authenticated visitors may submit requests.
- Requests cannot be read, edited, or deleted from the public browser client, protecting customer contact details.
3. Important Notes
- This is a single-business intake table and intentionally has no user account relationship.
- The public website only needs INSERT access; the business can review submissions through an authenticated administrative workflow later.
*/

CREATE TABLE IF NOT EXISTS dma_service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type text NOT NULL CHECK (request_type IN ('booking', 'quote', 'chat')),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  service text,
  preferred_date date,
  time_window text,
  details text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE dma_service_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view no service requests" ON dma_service_requests;
CREATE POLICY "Public can view no service requests"
ON dma_service_requests FOR SELECT
TO anon, authenticated
USING (false);

DROP POLICY IF EXISTS "Public can submit service requests" ON dma_service_requests;
CREATE POLICY "Public can submit service requests"
ON dma_service_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Public cannot update service requests" ON dma_service_requests;
CREATE POLICY "Public cannot update service requests"
ON dma_service_requests FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "Public cannot delete service requests" ON dma_service_requests;
CREATE POLICY "Public cannot delete service requests"
ON dma_service_requests FOR DELETE
TO anon, authenticated
USING (false);

CREATE INDEX IF NOT EXISTS dma_service_requests_created_at_idx
ON dma_service_requests (created_at DESC);
