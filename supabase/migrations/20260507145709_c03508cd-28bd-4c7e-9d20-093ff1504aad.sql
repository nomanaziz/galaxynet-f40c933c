
-- Remove public access from employees table entirely
DROP POLICY IF EXISTS "Public can view visible employees" ON public.employees;
DROP POLICY IF EXISTS "Public can view visible employees (safe columns via view)" ON public.employees;

-- Recreate the public view as SECURITY DEFINER (default) so it bypasses RLS on underlying table
DROP VIEW IF EXISTS public.public_employees;
CREATE VIEW public.public_employees AS
SELECT
  e.id,
  e.name,
  e.name_bn,
  e.department_id,
  e.designation_id,
  e.photo_url,
  e.sort_order,
  e.show_on_about,
  e.visible
FROM public.employees e
WHERE e.visible = true;

GRANT SELECT ON public.public_employees TO anon, authenticated;
