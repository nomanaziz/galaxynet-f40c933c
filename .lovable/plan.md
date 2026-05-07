## সমস্যা

এখনকার setup Lovable-র Telegram **connector gateway** ব্যবহার করছে — তাই আপনি UI-তে bot token দেওয়ার জায়গা পাচ্ছেন না। আপনি চান আগের মতো সরাসরি **Bot Token + Chat ID** দিলেই কাজ করবে (যেমন স্ক্রিনশটে দেখানো)।

## সমাধান

Connector gateway বাদ দিয়ে সরাসরি Telegram Bot API call করব (`https://api.telegram.org/bot<TOKEN>/sendMessage`)। তখন UI-তে যা দিব সেটাই ব্যবহার হবে।

### 1. `TelegramSettings.tsx`-এ নতুন "Bot Token" card

- উপরে নতুন card: **Bot Token** input (password type, eye toggle) + **Save Token** button
- Helper text: "Telegram-এ `@BotFather`-এ গিয়ে bot create করে token নিন (format: `123456:ABC-DEF...`)"
- Save → `site_settings.telegram_bot_token` key-তে store
- যদি token না থাকে — recipient list-এর উপরে warning banner: "আগে Bot Token দিন, তারপর message যাবে"

### 2. Edge function `notify-order-telegram` rewrite

- DB থেকে পড়বে: `telegram_enabled`, `telegram_bot_token`, `telegram_chat_ids`
- Direct fetch: `https://api.telegram.org/bot${token}/sendMessage` with `{chat_id, text, parse_mode: "HTML"}`
- Connector gateway / `LOVABLE_API_KEY` / `TELEGRAM_API_KEY` reference সব বাদ
- Test mode আগের মতই — per-chat error message return (যেমন "chat not found", "bot was blocked", "Forbidden: bot is not a member")
- Token না থাকলে clear error: `bot_token_not_configured`

### 3. কোনো DB migration লাগবে না

`site_settings` table-এ শুধু নতুন key `telegram_bot_token` upsert হবে। RLS already admin-only write allow করে। Token row হিসেবে DB-তে থাকবে (frontend admin-only fetch); যদি আপনি বলেন বরং Supabase **secret** হিসেবে রাখব, সেটাও করা যায় — কিন্তু তখন UI থেকে edit করা যাবে না, প্রতিবার আমাকে বলতে হবে। তাই DB-তে রাখছি যাতে আপনি নিজেই UI থেকে যেকোনো সময় change করতে পারেন।

## ফাইল

- edit: `src/pages/admin/TelegramSettings.tsx` (Bot Token card + warning banner)
- edit: `supabase/functions/notify-order-telegram/index.ts` (direct API, no gateway)

## Out of scope

- Webhook/incoming messages
- Per-event routing
- Multiple bot tokens
