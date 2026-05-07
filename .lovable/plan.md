## সমস্যা

আগের loop-এ TelegramSettings page তৈরি হয়েছিল বলে summary-তে আছে, কিন্তু আসলে file save হয়নি — `src/pages/admin/TelegramSettings.tsx` নেই, `AdminSidebar.tsx`-এ Telegram menu entry নেই, `App.tsx`-এ route নেই, এবং `notify-order-telegram` edge function এখনো শুধু secret থেকে chat ID পড়ছে। তাই Admin panel-এ Telegram option দেখা যাচ্ছে না।

## যা করব

1. **নতুন page**: `src/pages/admin/TelegramSettings.tsx`
   - Master switch (Enable/Disable) — `site_settings.telegram_enabled`
   - "Add Recipient" form: Label + Chat ID + Type (Personal/Group)
   - Recipients list (table) — প্রতি row-এ Test ও Delete button
   - Bangla helper: personal-এ `@userinfobot`, group-এ bot member হিসেবে add করতে হবে এবং `@RawDataBot` দিয়ে chat ID নিতে হবে
   - Data store: `site_settings` table-এ `telegram_chat_ids` key, value = JSON array `[{label, chat_id, type}]`

2. **Sidebar**: `AdminSidebar.tsx`-এর System group-এ "Telegram" entry (super-admin only, icon: Send)

3. **Route**: `App.tsx`-এ `/admin/telegram` → `<TelegramSettings />`

4. **Edge function**: `supabase/functions/notify-order-telegram/index.ts` rewrite করব — service-role Supabase client দিয়ে DB থেকে `telegram_enabled` ও `telegram_chat_ids` পড়বে, না থাকলে পুরনো `TELEGRAM_ADMIN_CHAT_ID` secret-এ fallback. নতুন `{ test: true, chatId, label }` mode যোগ — Test button থেকে call হবে এবং প্রতি chat-এর জন্য send result + error detail return করবে।

5. **DB**: কোনো migration লাগবে না — existing `site_settings` table ব্যবহার, RLS already admin upsert allow করে।

## যা করব না

- Two-way bot / incoming messages
- Per-event routing (যেকোনো order event সব configured chat-এ যাবে)
- API key UI input — `TELEGRAM_API_KEY` Lovable connector secret হিসেবে already managed

## ফাইল

- নতুন: `src/pages/admin/TelegramSettings.tsx`
- edit: `src/components/admin/AdminSidebar.tsx`, `src/App.tsx`, `supabase/functions/notify-order-telegram/index.ts`
