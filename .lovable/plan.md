

## Multi-Page Visual Enhancement & New Connection Integration

### Changes Overview

| # | Task | Files |
|---|------|-------|
| 1 | Payment page — add PageHeroDark with breadcrumb image | `src/pages/Payment.tsx` |
| 2 | Offers page — fix empty state, add thematic breadcrumb | `src/pages/Offers.tsx` |
| 3 | Notices page — add notice-themed breadcrumb image | `src/pages/Notices.tsx` |
| 4 | Services page — already has breadcrumb, keep as-is | No change needed |
| 5 | Packages page — add themed breadcrumb image | `src/pages/Packages.tsx` |
| 6 | Footer — remove gradient strip, use simple solid dark bg | `src/components/Footer.tsx` |
| 7 | Package price box — add accent border | `src/pages/Index.tsx`, `src/pages/Packages.tsx` |
| 8 | "যোগাযোগ করুন" buttons → link to `/new-connection` | `src/pages/Index.tsx`, `src/pages/Packages.tsx`, `src/pages/Services.tsx` |
| 9 | Add "New Connection" button to homepage hero | `src/pages/Index.tsx` |
| 10 | Generate 4 breadcrumb images | New assets via AI generation |

### Detailed Changes

**1. Payment page (`src/pages/Payment.tsx`)**
- Replace the plain `<section className="page-hero">` with `<PageHeroDark>` component
- Use a new breadcrumb image (payment/finance themed — will generate `breadcrumb-payment.jpg`)
- Import PageHeroDark and the new image asset

**2. Offers page (`src/pages/Offers.tsx`)**
- Already uses PageHeroDark — change breadcrumb image from `banner-speed.jpg` to a new offers/promo themed image (`breadcrumb-offers.jpg`)
- The "no offers" empty state is working correctly (shows when no active offers exist in DB) — no code fix needed, user needs to add offers via admin

**3. Notices page (`src/pages/Notices.tsx`)**
- Already uses PageHeroDark with `breadcrumb-city.jpg` — replace with a more notice/update themed image (`breadcrumb-notices.jpg`)

**4. Packages page (`src/pages/Packages.tsx`)**
- Already uses PageHeroDark with `banner-fiber.jpg` — replace with a dedicated packages-themed image (`breadcrumb-packages.jpg`)

**5. Footer simplification (`src/components/Footer.tsx`)**
- Remove the `gradient-orange-strip` section (lines 55-71)
- Keep the footer as a clean, simple dark section without the gradient service icons strip

**6. Price box border (`src/pages/Index.tsx` + `src/pages/Packages.tsx`)**
- Add `border border-accent/30` to the price display div (`bg-accent/8` wrapper) in both homepage package cards and Packages page cards

**7. "যোগাযোগ করুন" → `/new-connection`**
- In `src/pages/Index.tsx`: Change the CTA banner "Contact Us" link from `/contact` to `/new-connection`
- In `src/pages/Packages.tsx`: Change "Contact Us" button in PlanCard and custom plan CTA from `/contact` to `/new-connection`
- In `src/pages/Services.tsx`: Change CTA "Contact Us" from `/contact` to `/new-connection`

**8. Homepage "New Connection" button (`src/pages/Index.tsx`)**
- Add a prominent "New Connection" / "নতুন সংযোগ" button in the hero section alongside existing buttons
- Style with accent color to stand out

**9. Breadcrumb images**
- Generate 4 new thematic images using AI:
  - `breadcrumb-payment.jpg` — digital payment / mobile banking theme
  - `breadcrumb-offers.jpg` — promotions / deals theme
  - `breadcrumb-notices.jpg` — bulletin board / announcements theme
  - `breadcrumb-packages.jpg` — internet speed / fiber packages theme

### Technical Notes
- All breadcrumb images will be generated as 1920x400 dark-toned images suitable for the PageHeroDark overlay
- No database changes required
- Footer gradient CSS class (`gradient-orange-strip`) can remain in CSS but won't be used

