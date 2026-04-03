
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'accepted';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'out_of_coverage';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'cancelled';
