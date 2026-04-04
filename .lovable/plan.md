

## Payment Page Redesign & Admin Control

### Problem
1. Payment page `/payment` is currently showing blank/broken after recent updates
2. User wants the page renamed to "Pay Bill" (বিল পরিশোধ)
3. Need a proper admin control panel for payment page settings (hero text, Quick Bill Pay URL, etc.)

### Changes

**1. Redesign Payment Page (`src/pages/Payment.tsx`)**
- Rename route from `/payment` to `/pay-bill`
- Update hero title to "Pay Bill" / "বিল পরিশোধ"
- Redesign with a modern, clean layout:
  - **Hero section** with gradient background (no external image dependency)
  - **Quick Bill Pay** section with client code input and animated CTA button
  - **Payment methods grid** with hover effects, brand-colored cards with logo, account number, and instructions
  - **Detail modal** with improved layout for screenshots and step-by-step instructions
- Make the Quick Bill Pay portal URL configurable from admin (stored in `site_settings`)

**2. Update Route & Navigation**
- `src/App.tsx`: Change route from `/payment` to `/pay-bill`
- `src/components/Footer.tsx`: Update link href to `/pay-bill`
- Menu items in DB already use dynamic URLs, so those will work automatically

**3. Admin Payment Settings (`src/pages/admin/PaymentManager.tsx`)**
- Add a **Settings tab** at the top of the Payment Manager with:
  - Quick Bill Pay portal URL (currently hardcoded to `https://portal.galaxynetbd.com/BillPayment/Index`)
  - Hero title (EN/BN) for the payment page
  - Hero subtitle (EN/BN)
  - Toggle to enable/disable Quick Bill Pay section
- These settings stored in `site_settings` table (already exists) with keys like `payment_portal_url`, `payment_hero_title`, etc.
- Keep the existing payment methods CRUD table below the settings

**4. Fix the Blank Page Issue**
- Remove the `breadcrumb-payment.jpg` import dependency — use a CSS gradient hero instead via `PageHeroDark` or inline gradient
- Ensure the page renders without external asset failures

### Files to Modify
1. `src/pages/Payment.tsx` — Full redesign with gradient hero, configurable portal URL from site_settings
2. `src/pages/admin/PaymentManager.tsx` — Add settings tab for page configuration
3. `src/App.tsx` — Route change `/payment` → `/pay-bill`
4. `src/components/Footer.tsx` — Update footer link

### Technical Details
- Site settings keys: `payment_portal_url`, `payment_hero_title`, `payment_hero_title_bn`, `payment_hero_subtitle`, `payment_hero_subtitle_bn`, `payment_quick_pay_enabled`
- No DB migration needed — `site_settings` table already supports key-value pairs
- Payment page will fetch settings via `supabase.from("site_settings")` query on load
- Admin panel uses upsert pattern for site_settings (insert on conflict update)

