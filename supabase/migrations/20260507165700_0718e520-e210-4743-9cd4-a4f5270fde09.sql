create extension if not exists pg_net with schema extensions;

insert into public.site_settings (key, value)
values ('telegram_enabled', 'true')
on conflict (key) do update set value = 'true';

create or replace function public.notify_telegram_on_new_order()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  function_url text := 'https://txbmzkpmjjanejnkqksd.supabase.co/functions/v1/notify-order-telegram';
  anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4Ym16a3BtamphbmVqbmtxa3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNzc5NjksImV4cCI6MjA4OTY1Mzk2OX0.WMBTRAjQZ8rCJC3b_kKkKX-WaYyXCgbJ4Xy8R6D1SYI';
begin
  perform net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || anon_key,
      'apikey', anon_key
    ),
    body := jsonb_build_object('orderId', NEW.id::text)
  );

  return NEW;
exception when others then
  return NEW;
end;
$$;

drop trigger if exists trg_notify_telegram_on_new_order on public.connection_orders;

create trigger trg_notify_telegram_on_new_order
after insert on public.connection_orders
for each row
execute function public.notify_telegram_on_new_order();