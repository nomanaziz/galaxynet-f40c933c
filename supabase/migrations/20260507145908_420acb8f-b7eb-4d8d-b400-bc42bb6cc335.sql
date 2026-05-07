
DROP POLICY IF EXISTS "Anyone can submit orders" ON public.connection_orders;

CREATE POLICY "Anyone can submit orders"
ON public.connection_orders
FOR INSERT
TO public
WITH CHECK (
  length(trim(name)) > 0
  AND length(trim(phone)) >= 6
  AND length(trim(address)) > 0
  AND status = 'pending'
  AND assigned_to IS NULL
);
