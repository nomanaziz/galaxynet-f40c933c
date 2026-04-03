

## Make Site More Colorful, Add Banners, Breadcrumb Images & Mobile-Focus

### Overview
Redesign the site to be more vibrant and consumer-attractive, inspired by galaxynetbd.com's color tones (dark navy hero, orange-pink gradients) and xplorenetbd.com's content structure (cache server logos, "How to Subscribe" steps, service cards with images).

### 1. Color & Gradient Overhaul (`src/index.css`)
- Replace the current soft/muted hero background with a **bold dark navy-to-blue gradient** (like galaxynetbd.com's hero)
- Add an **orange-to-pink gradient bar** utility class for service icon strips
- Update `.page-hero` to use a dark overlay style with white text instead of the current pale background
- Add new gradient utilities: `.gradient-orange-pink`, `.gradient-navy-dark`

### 2. Homepage Hero Redesign (`src/pages/Index.tsx`)
- Replace the abstract WiFi circle illustration with a **generated hero banner image** (happy family/people using internet, fiber optic theme) using AI image generation
- Make hero use `hero-gradient` (dark navy) with white text instead of `hero-gradient-soft`
- Add a **starting price badge** like galaxynetbd.com: "৳750/mo" with an icon
- Bigger, bolder CTA buttons with gradient backgrounds

### 3. Add 3-4 Banner/Image Sections to Homepage (`src/pages/Index.tsx`)
Generate and add these banner images using AI image generation:
- **Banner 1 - Fiber Optic**: After hero — full-width colorful strip showing fiber cables/connectivity (used in service icons bar like galaxynetbd.com)
- **Banner 2 - Gaming & Cache**: Before packages section — gaming setup, low latency visuals, cache server logos (Google, Facebook, YouTube, Netflix, TikTok marquee like xplorenetbd.com)
- **Banner 3 - High Speed**: Between packages and coverage — speed/performance themed with speedometer visuals
- **Banner 4 - How to Subscribe**: 3-step process section (Registration → Installation → Payment) like galaxynetbd.com, with icons and descriptions

### 4. Breadcrumb Hero Images for Inner Pages
Update these pages to replace the plain `.page-hero` with a **dark gradient overlay on a background image** related to each page's theme:
- `src/pages/Packages.tsx` — fiber optic cables image
- `src/pages/Services.tsx` — network/server room image
- `src/pages/Coverage.tsx` — city/map image
- `src/pages/Contact.tsx` — customer support image
- `src/pages/About.tsx` — team/office image
- `src/pages/Notices.tsx` — notice board image
- `src/pages/Offers.tsx` — promotion/deals image

Each page hero will have: dark gradient overlay + background image + white heading text + breadcrumb trail (Home > Page Name)

### 5. Mobile-First Improvements
- Homepage hero: Stack layout, larger touch-friendly buttons, full-width CTAs on mobile
- Package cards: Full-width single column on mobile with larger tap targets
- Service icons bar: Horizontal scroll on mobile instead of wrapping
- Trust stats: 2-column grid with bigger icons on mobile
- Navigation: Already has mobile sheet menu — ensure all new sections are responsive
- Banner images: Use `object-cover` with appropriate aspect ratios for mobile
- Font sizes: Ensure readability on small screens (min 14px body text)

### 6. Consumer-Attractive Content Additions (`src/pages/Index.tsx`)
Inspired by xplorenetbd.com:
- **Cache Server Logos Marquee**: Add scrolling logos strip (Google, Facebook, YouTube, Netflix, TikTok) with label "Connected to the best cache servers"
- **"How to Subscribe" Section**: 3 steps with icons — Register → Installation → Payment (like galaxynetbd.com)
- **"Who We Are" Mini Section**: Brief about section with trust points (Positive Attitude, Reliable Network, Lightning-Fast Speeds) before the CTA banner

### Technical Details

**Files to modify:**
| File | Changes |
|------|---------|
| `src/index.css` | New gradient utilities, updated `.page-hero` with dark overlay variant, mobile-first responsive tweaks |
| `src/pages/Index.tsx` | Dark hero, 4 banner sections, cache logos marquee, how-to-subscribe steps, mobile-optimized layouts |
| `src/pages/Packages.tsx` | Hero with breadcrumb image + dark overlay + breadcrumb trail |
| `src/pages/Services.tsx` | Hero with breadcrumb image + dark overlay + breadcrumb trail |
| `src/pages/Coverage.tsx` | Hero with breadcrumb image + dark overlay + breadcrumb trail |
| `src/pages/Contact.tsx` | Hero with breadcrumb image + dark overlay + breadcrumb trail |
| `src/pages/About.tsx` | Hero with breadcrumb image + dark overlay + breadcrumb trail |
| `src/pages/Notices.tsx` | Hero with breadcrumb image + dark overlay + breadcrumb trail |
| `src/pages/Offers.tsx` | Hero with breadcrumb image + dark overlay + breadcrumb trail |

**Image generation:** Will use AI image generation (Nano banana) to create 4 homepage banners and 7 breadcrumb hero background images — all themed around fiber internet, networking, gaming, and customer service. Images will be stored in Supabase storage or as base64 in the code.

**New CSS classes:**
- `.page-hero-dark` — dark overlay hero with background image
- `.gradient-strip` — orange-to-pink gradient for icon strips
- `.cache-marquee` — auto-scrolling logo strip

