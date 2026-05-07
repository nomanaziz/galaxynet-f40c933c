# New Connection → Telegram Notification + Captcha

বর্তমানে form submit হলে browser থেকে fire-and-forget call drop হয়ে যাচ্ছে, তাই Telegram-এ message যাচ্ছে না। সমাধান: DB trigger যাতে server-side থেকেই notification trigger হয় (browser বন্ধ হলেও কাজ করবে), এবং একটা simple math captcha যাতে bot-spam না হয়।

## ১. Database Trigger (asynchronous, reliable)

Migration যা করবে:

- `pg_net` extension enable করা (extensions schema-তে)
- `public.notify_telegram_on_new_order()` function — `connection_orders` row insert হলে edge function `notify-order-telegram`-কে `{ orderId }` payload সহ async POST করবে। কোনো error হলেও insert block হবে না।
- `connection_orders` AFTER INSERT trigger — প্রতি new row-তে উপরের function ডাকবে।

Function URL এবং anon key trigger-এর ভেতরে hardcoded থাকবে (anon key already public)।

## ২. Edge Function Update (`notify-order-telegram`)

`orderId` mode যোগ হবে:

- যদি body-তে `orderId` থাকে কিন্তু `name`/`phone` না থাকে, function নিজে DB থেকে order + linked package fetch করে message বানাবে।
- পুরনো client payload mode (NewConnection page থেকে সরাসরি call) এখনও কাজ করবে — backward compatible।
- Notes column থেকে `dedicated_mbps`, `source` parse করে message-এ দেখাবে।
- Telegram message-এ থাকবে: Name, Phone, Area, Address, Category, Package, Dedicated Mbps (যদি থাকে), Notes, Order timestamp।

## ৩. Frontend (`src/pages/NewConnection.tsx`)

- বর্তমান fire-and-forget invoke সরিয়ে দেওয়া হবে — এখন trigger সব করবে, ফলে duplicate message হবে না।
- নতুন **simple math captcha** যোগ:
  - Submit button-এর উপরে দুটি random single-digit সংখ্যার যোগফল চাইবে (যেমন: "৩ + ৭ = ?")
  - Bangla এবং English উভয়ে label
  - প্রতিবার page load বা ভুল answer-এ refresh
  - একটা ছোট 🔄 refresh icon দিয়ে user নতুন প্রশ্ন আনতে পারবে
  - Captcha না মিললে DB-তেই insert হবে না, error toast দেখাবে
  - Submit success হলে captcha reset হবে

## ৪. Files

- **New migration** — `pg_net` + trigger function + trigger
- `supabase/functions/notify-order-telegram/index.ts` — `orderId` lookup mode
- `src/pages/NewConnection.tsx` — fire-and-forget call সরানো + math captcha state ও UI

## প্রভাব

- Form submit → DB insert → Trigger → Edge function → Telegram (browser-independent, 100% reliable)
- Bot/spam submission কমবে captcha-র কারণে
- Admin panel-এর "Telegram Settings" page এবং Test button আগের মতই কাজ করবে।
