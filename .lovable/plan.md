
## Two Features

### 1. Dark Mode Toggle (soft dark, not pitch black)

**Theme**
- Use a soft dark palette: background `hsl(220 20% 12%)` (deep slate, not pure black), foreground `hsl(210 20% 92%)`, cards slightly lighter than bg, borders subtle. Keep brand teal/orange accents intact but slightly desaturated for dark mode.
- All tokens defined in `src/index.css` under `.dark { ... }` matching the existing `:root` token structure (background, foreground, card, primary, secondary, muted, accent, border, input, ring, sidebar tokens).

**Theme provider**
- Add lightweight provider `src/contexts/ThemeContext.tsx` (light/dark/system, persists to `localStorage` key `gn-theme`, toggles `.dark` class on `<html>`).
- Wrap app in `src/main.tsx`.

**Toggle UI**
- Add a sun/moon icon button (lucide `Sun`/`Moon`) in `src/components/TopBar.tsx` next to the language switcher (visible on desktop) and inside the mobile menu in `Navbar.tsx`.

**Scope**
- Front panel only — admin pages keep their current look (admin layout already has its own muted background and works fine in light).

### 2. Telegram Alert on New Connection Order

**Flow**

```
NewConnection.tsx submits → connection_orders insert →
                          → invoke edge function `notify-order-telegram` →
                          → sends formatted message to admin chat via Telegram connector gateway
```

**Backend**
- Connect the **Telegram** connector via `standard_connectors--connect` (provides `TELEGRAM_API_KEY` + `LOVABLE_API_KEY`).
- Add admin chat ID(s) as a Supabase secret `TELEGRAM_ADMIN_CHAT_ID` (will ask user for it after connector is linked — they get it by messaging their bot once and we'll provide a tiny helper, or they paste it from `@userinfobot`).
- New edge function `supabase/functions/notify-order-telegram/index.ts`:
  - `verify_jwt = false` (called right after public order insert).
  - Validates body with zod (name, phone, address, area, package label, preferred date, notes).
  - POSTs to `https://connector-gateway.lovable.dev/telegram/sendMessage` with HTML-formatted message:
    ```
    🆕 New Connection Order
    Name: ...
    Phone: ...
    Area: ...
    Address: ...
    Package: ...
    Preferred date: ...
    Notes: ...
    ```
  - Returns 200 even on Telegram failure (logs error) so the user submission UX isn't blocked.

**Frontend**
- In `src/pages/NewConnection.tsx`, after a successful insert into `connection_orders`, fire-and-forget `supabase.functions.invoke('notify-order-telegram', { body: {...} })`. No await blocking the success toast.

### Order of Implementation
1. Dark mode tokens + provider + toggles.
2. Connect Telegram connector (will trigger the connection picker for the user).
3. Ask user for the chat ID, store as secret.
4. Create edge function + wire into NewConnection submit.

### Files to Create / Edit
- `src/index.css` — add `.dark` token block
- `src/contexts/ThemeContext.tsx` — new
- `src/main.tsx` — wrap with ThemeProvider
- `src/components/TopBar.tsx`, `src/components/Navbar.tsx` — theme toggle button
- `supabase/functions/notify-order-telegram/index.ts` — new
- `supabase/config.toml` — register function with `verify_jwt = false`
- `src/pages/NewConnection.tsx` — invoke edge function after insert
