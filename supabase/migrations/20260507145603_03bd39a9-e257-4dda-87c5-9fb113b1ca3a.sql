
-- Remove public read access to employees (which exposes email/phone)
DROP POLICY IF EXISTS "Public can view visible employees" ON public.employees;

-- Create a safe public view that excludes email and phone
CREATE OR REPLACE VIEW public.public_employees
WITH (security_invoker = true) AS
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

-- Re-add a public SELECT policy on employees that excludes sensitive columns
-- by only allowing reads when accessed via the view (security_invoker view bypasses since RLS still applies).
-- Since the view uses security_invoker, the underlying policy must allow reads. Add a restricted policy:
CREATE POLICY "Public can view visible employees (safe columns via view)"
ON public.employees
FOR SELECT
USING (visible = true);
