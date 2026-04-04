-- Add 'division' to the coverage_location_type enum
ALTER TYPE public.coverage_location_type ADD VALUE IF NOT EXISTS 'division' BEFORE 'district';

-- Add enabled column to coverage_locations
ALTER TABLE public.coverage_locations ADD COLUMN IF NOT EXISTS enabled boolean NOT NULL DEFAULT true;