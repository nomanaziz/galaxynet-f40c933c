CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.notify_telegram_on_new_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  function_url text := 'https://txbmzkpmjjanejnkqksd.supabase.co/functions/v1/notify-order-telegram';
  anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4Ym16a3BtamphbmVqbmtxa3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNzc5NjksImV4cCI6MjA4OTY1Mzk2OX0.WMBTRAjQZ8rCJC3b_kKkKX-WaYyXCgbJ4Xy8R6D1SYI';
BEGIN
  PERFORM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || anon_key,
      'apikey', anon_key
    ),
    body := jsonb_build_object('orderId', NEW.id::text)
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_telegram_on_new_order ON public.connection_orders;
CREATE TRIGGER trg_notify_telegram_on_new_order
AFTER INSERT ON public.connection_orders
FOR EACH ROW
EXECUTE FUNCTION public.notify_telegram_on_new_order();