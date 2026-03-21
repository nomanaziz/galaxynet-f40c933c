
-- Create location type enum
CREATE TYPE public.coverage_location_type AS ENUM ('district', 'thana', 'zone');

-- Create coverage_locations table
CREATE TABLE public.coverage_locations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  name_bn text,
  type coverage_location_type NOT NULL,
  parent_id uuid REFERENCES public.coverage_locations(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add location_id to coverage_areas
ALTER TABLE public.coverage_areas ADD COLUMN location_id uuid REFERENCES public.coverage_locations(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.coverage_locations ENABLE ROW LEVEL SECURITY;

-- Public SELECT
CREATE POLICY "Public can view coverage locations"
  ON public.coverage_locations FOR SELECT
  USING (true);

-- Admin CRUD
CREATE POLICY "Admins can insert coverage locations"
  ON public.coverage_locations FOR INSERT TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update coverage locations"
  ON public.coverage_locations FOR UPDATE TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete coverage locations"
  ON public.coverage_locations FOR DELETE TO authenticated
  USING (is_admin(auth.uid()));
