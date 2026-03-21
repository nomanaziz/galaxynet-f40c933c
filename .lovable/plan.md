

## Fix Homepage Button CSS + Change All Section Titles to Blue

### Problem
1. **Buttons CSS issue** — The reference image shows the CTA banner section has proper orange button styling, but the "Contact Us" outline button appears broken/invisible against the dark background (white border blending in). The `variant="outline"` button in the CTA banner needs visible styling.
2. **Section titles use `text-foreground` (dark gray)** — User wants all section headings to be blue (brand color) instead.

### Changes in `src/pages/Index.tsx`

**Fix CTA banner "Contact Us" button (line 321):**
- Change from `border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10` to `border-white/40 text-white hover:bg-white/10` for proper visibility on the dark gradient background.

**Change all section titles from `text-foreground` to `text-primary` (brand blue):**
- Line 61: Hero h1 — `text-foreground` → `text-primary`
- Line 125: "Why Choose Galaxy Net?" — `text-foreground` → `text-primary`
- Line 156: "Our Services" — `text-foreground` → `text-primary`
- Line 183: "Popular Packages" — `text-foreground` → `text-primary`
- Line 239: "Check If We're In Your Area" — `text-foreground` → `text-primary`
- Line 256: "Customer Reviews" — `text-foreground` → `text-primary`
- Line 291: "Our Partners" — `text-foreground` → `text-primary`

Single file change: `src/pages/Index.tsx`

