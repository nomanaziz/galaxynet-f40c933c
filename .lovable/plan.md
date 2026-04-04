

## Redesign Payment Page Like Exord Pay-Bill (Galaxy Net Branded)

### Overview
Replace the current Payment page with a rich, structured layout matching the Exord pay-bill page design — rebranded as Galaxy Net with dummy data.

### Page Sections (Top to Bottom)

**1. Quick Pay Hero Banner**
- Card with subtle background pattern, "Quick Pay" heading in accent color
- Description text + "PAY NOW" button linking to `https://portal.galaxynetbd.com/quickpay`
- No client code input needed — just a direct button like Exord

**2. "How to pay?" Section**
- Section heading with left accent border
- 3 category cards with icons: Mobile Banking, Online Payment, Bank Transfer
- Clicking each scrolls/shows the relevant section below

**3. Pay bill with Mobile Banking (Tabs: bKash / Nagad)**
- Tab buttons (bKash, Nagad) — styled as pill buttons
- **bKash tab**: 5 step-by-step instructions (rebranded "Galaxy Net" instead of "Exord Online", "Galaxy Net ID" instead of "Exord ID")
- **Nagad tab**: 4 step-by-step instructions similarly rebranded
- No embedded videos (skip the Facebook video embeds)

**4. Portal Payment Options**
- Section heading with accent border
- Grid of payment gateway logos (Visa, Mastercard, Amex, bKash, Nagad, Rocket, etc.) — using emoji/text placeholders or small colored boxes since we don't have actual logo files
- Checkbox for terms agreement + "Pay Now" button

**5. Direct Bank Transfer**
- Section heading with accent border
- Grid of 5 bank cards (3 columns), each with:
  - Bank name header area (colored)
  - Account Name: Galaxy Net
  - Account No: 00000000000 (dummy)
  - Branch name: 00000000
  - Routing No: 000000000
- Banks: BRAC Bank, Eastern Bank, City Bank, ONE Bank, Dutch-Bangla Bank

**6. USSD Warning Notice**
- Yellow warning box at bottom
- "You must need to contact with our helpline to update your payment if you use USSD, Bank Payment or Mobile Banking App to pay the bill."
- Helpline: 00000000000
- Email: accounts@galaxynetbd.com

### Files to Modify
- `src/pages/Payment.tsx` — Complete rewrite with new sections (keeps TopBar/Navbar/Footer, removes old card grid and modal)

### Technical Details
- All data is hardcoded/static (no DB changes needed)
- Existing `payment_methods` table data still exists but won't be used on this page anymore
- Bengali translations included via existing `t()` helper
- Responsive grid layout using Tailwind
- Smooth scroll navigation from "How to pay" category cards to respective sections

