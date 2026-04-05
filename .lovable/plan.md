

## Offers ও Pay Bill পেজ — Exord-style Redesign + Full Admin Control

### Reference Design (exord.bd)
- **Offers**: 4-column card grid with image, title, description. Bottom disclaimer section with helpline info.
- **Pay Bill**: Quick Pay hero banner → "How to pay?" category icons (Mobile Banking, Online Payment, Bank Transfer) → Tabbed payment instructions (bKash/Nagad with step-by-step) → Portal payment section → Direct bank transfer cards → Helpline disclaimer.

---

### 1. Offers Page Redesign (`src/pages/Offers.tsx`)

**Layout (matching exord.bd):**
- Section header: "Latest **offers**" with left orange border accent
- 4-column responsive grid (1 col mobile, 2 col tablet, 4 col desktop)
- Each card: full-width image top → title → description text (no badges/tags — cleaner look)
- Bottom disclaimer section with warning icon + helpline info (fetched from `site_settings`)
- Remove the current badge/type chip system from public view (keep in admin)

**Admin already works** — OffersManager has full CRUD + image upload. No changes needed there.

### 2. Pay Bill Page Redesign (`src/pages/Payment.tsx`)

**Layout (matching exord.bd):**
- **Quick Pay Banner**: Gradient/decorated card with description text + "PAY NOW" button (URL from `site_settings`)
- **"How to pay?" Section**: Section header with accent border → 3-4 category icon cards (Mobile Banking, Online Payment, Bank Transfer, USSD Code) — these are visual navigation, not clickable
- **"Pay bill with mobile banking" Section**: Tabbed interface showing payment methods that have `instructions` — each tab shows step-by-step text instructions (from `payment_methods` table)
- **Portal Payment Section**: Shows online payment options with screenshot/image
- **Direct Bank Transfer Section**: Grid of bank cards showing account details (from `payment_methods` where type could be "bank")
- **Bottom Disclaimer**: Warning icon + helpline info

**Route change**: `/payment` → `/pay-bill` (update App.tsx + Footer.tsx)

### 3. Admin: Pay Bill Page Settings

Add a **Settings tab** to `PaymentManager.tsx`:
- `payment_portal_url` — Quick Pay button URL
- `payment_hero_title` / `payment_hero_title_bn`
- `payment_hero_subtitle` / `payment_hero_subtitle_bn`
- `payment_helpline_text` / `payment_helpline_text_bn`
- Uses `site_settings` table (upsert pattern), no migration needed

### 4. Payment Methods Table Enhancement

**DB Migration**: Add a `category` column to `payment_methods`:
```sql
ALTER TABLE payment_methods ADD COLUMN category text NOT NULL DEFAULT 'mobile_banking';
```
Categories: `mobile_banking`, `online_payment`, `bank_transfer`, `ussd`

This lets the Pay Bill page group methods into the correct sections automatically.

**Update PaymentManager.tsx**: Add category dropdown to the form.

---

### Files to Modify
1. `src/pages/Offers.tsx` — Exord-style 4-col grid, accent header, disclaimer section
2. `src/pages/Payment.tsx` — Full redesign with sections (Quick Pay, How to Pay, Mobile Banking tabs, Bank Transfer cards, disclaimer)
3. `src/pages/admin/PaymentManager.tsx` — Add Settings tab + category field
4. `src/App.tsx` — Route `/payment` → `/pay-bill`
5. `src/components/Footer.tsx` — Link update to `/pay-bill`

### DB Migration
- Add `category` column to `payment_methods` table

