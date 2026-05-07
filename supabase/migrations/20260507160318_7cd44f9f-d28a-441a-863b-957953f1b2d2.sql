
-- Helper function: check if a user has a specific staff permission
CREATE OR REPLACE FUNCTION public.has_staff_permission(_user_id uuid, _permission text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff_permissions
    WHERE user_id = _user_id AND permission = _permission
  )
$$;

-- Connection Orders: allow staff with 'orders' permission
CREATE POLICY "Staff with orders permission can view orders"
  ON public.connection_orders FOR SELECT
  TO authenticated
  USING (public.has_staff_permission(auth.uid(), 'orders'));

CREATE POLICY "Staff with orders permission can update orders"
  ON public.connection_orders FOR UPDATE
  TO authenticated
  USING (public.has_staff_permission(auth.uid(), 'orders'));

CREATE POLICY "Staff with orders permission can delete orders"
  ON public.connection_orders FOR DELETE
  TO authenticated
  USING (public.has_staff_permission(auth.uid(), 'orders'));
