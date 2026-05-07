
-- Recreate view with security_invoker so it doesn't trigger SECURITY DEFINER VIEW lint
DROP VIEW IF EXISTS public.public_employees;
CREATE VIEW public.public_employees
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

-- Allow public to read visible rows from employees table, but only safe columns (column-level grants enforce this)
CREATE POLICY "Public can view visible employees"
ON public.employees
FOR SELECT
USING (visible = true);

-- Revoke all then grant only non-sensitive columns to anon/authenticated
REVOKE SELECT ON public.employees FROM anon, authenticated;
GRANT SELECT (id, name, name_bn, department_id, designation_id, photo_url, sort_order, show_on_about, visible, created_at)
  ON public.employees TO anon, authenticated;
