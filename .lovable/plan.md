

## Import Bangladesh Location Data & Add Enable/Disable System

### What This Does
Load the full Bangladesh Division > District > Thana hierarchy (8 divisions, 64 districts, 622 thanas) from the uploaded Excel into the coverage system. Each thana also becomes a coverage area. Admin can disable any location level (e.g., disable a whole district) and all areas underneath automatically hide from the public coverage page.

### Current State
- Hierarchy: district > thana > zone (3 levels, enum `coverage_location_type`)
- Existing data: 1 district, 2 thanas, 8 zones, 2 coverage areas
- No enable/disable toggle on locations

### Plan

**1. Database Migration**
- Add `division` to the `coverage_location_type` enum (new top level)
- Add `enabled` boolean column to `coverage_locations` (default `true`)
- This makes the hierarchy: division > district > thana > zone

**2. Seed Data via Edge Function**
- Create an edge function `seed-bangladesh-locations` that:
  - Clears existing coverage_locations and coverage_areas (fresh start since only test data exists)
  - Inserts 8 Divisions (Dhaka, Chattogram, Rajshahi, Khulna, Barisal, Sylhet, Rangpur, Mymensingh)
  - Inserts 64 Districts under their divisions
  - Inserts 622 Thanas under their districts (with Bangla names from the Excel)
  - Creates a coverage_area for each thana (622 areas), linked to the thana's location_id, with `available = true`

**3. Update CoverageManager (Admin)**
- Add an enable/disable toggle (Switch) on each location in the Locations tab
- When a district is disabled, visually indicate it (dimmed/strikethrough)
- Update the hierarchy display to support the new "division" level (division > district > thana > zone)
- Update the Areas tab cascading dropdowns to include division as the first level

**4. Update Coverage Page (Public)**
- When fetching coverage areas, also fetch locations with `enabled` status
- Filter out areas whose parent chain contains any disabled location
- For example: if "Dhaka" district is disabled, all thanas under Dhaka won't appear in the coverage list
- The cascading filters (Division > District > Thana > Zone) will also exclude disabled locations

**5. Update Coverage.tsx Filters**
- Add Division as the first cascading dropdown
- Adjust the existing District > Thana > Zone filters to work under Division

### Files to Modify
1. **Migration SQL** -- add `division` enum value, add `enabled` column
2. **New edge function** `supabase/functions/seed-bangladesh-locations/index.ts` -- seed all data
3. **`src/pages/admin/CoverageManager.tsx`** -- division level, enable/disable toggle
4. **`src/pages/Coverage.tsx`** -- division filter, respect `enabled` flag
5. **`src/integrations/supabase/types.ts`** -- will auto-update after migration

### Technical Details
- The Excel has 622 thanas across 64 districts and 8 divisions
- Each thana becomes both a `coverage_location` (type=thana) AND a `coverage_area`
- The `enabled` column on `coverage_locations` cascades logically: if a division is disabled, all districts/thanas/zones underneath are treated as disabled on the public page
- No changes to RLS policies needed -- the filtering is done client-side based on the `enabled` boolean

