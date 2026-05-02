-- Migration: 20260430_add_bilingual_competitors
-- Adds summary_en column to scan_results (idempotent).
-- JSONB opportunities column is schemaless; no ALTER needed for
-- what_en / why_it_matters_en / missing_piece_en / competitors fields.

ALTER TABLE public.scan_results
  ADD COLUMN IF NOT EXISTS summary_en TEXT;

-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to be idempotent
DROP POLICY IF EXISTS "allow_public_read" ON public.scan_results;
DROP POLICY IF EXISTS "allow_service_role_write" ON public.scan_results;

-- Authenticated users (including anon with anon key) can read all rows
CREATE POLICY "allow_public_read"
  ON public.scan_results
  FOR SELECT
  USING (true);

-- Only service role can insert/update/delete
CREATE POLICY "allow_service_role_write"
  ON public.scan_results
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
