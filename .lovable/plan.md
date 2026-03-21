

## Galaxy Net — Full PRD Redesign Implementation Plan

This is a major overhaul covering: new pages, new sections, admin-controlled content, database changes, and connecting all frontend pages to live Supabase data.

---

### What Already Exists
- Full admin panel with CRUD for packages, coverage, orders, pages, notices, settings, menu, payments, media
- Language system (Bangla/English)
- All frontend pages exist but use **hardcoded data** (not fetching from Supabase)
- Database tables: packages, coverage_areas, connection_orders, pages, notices, site_settings, payment_methods, menu_items, user_roles

### What Needs to Change

---

#### Phase 1: Database — New Tables & Fields

**New table: `offers`**
- id, title, title_bn, description, description_bn, image_url, expiry_date, active, type (enum: offer/referral/coupon), created_at

**New table: `testimonials`**
- id, name, name_bn, location, location_bn, rating (int), text, text_bn, visible, sort_order, created_at

**New table: `partners`**
- id, name, logo_url, sort_order, visible, created_at

**New table: `homepage_features`**
- id, icon_name, title, title_bn, description, description_bn, sort_order, visible, created_at

**Add columns to `packages`:**
- `type` enum: home / corporate / dedicated (replace existing `category`)

**Add to `site_settings`** (seed data):
- hero_banner_url, hero_title_bn, hero_title_en, hero_subtitle_bn, hero_subtitle_en, hero_cta_text_bn, hero_cta_text_en, hero_cta_url
- topbar_notice_bn, topbar_notice_en, hotline
- selfcare_url, selfcare_enabled
- partner_section_title_bn, partner_section_title_en

---

#### Phase 2: New Frontend Pages

**Offers Page (`/offers`)**
- Sections: Running Offers, Referral Program, Coupons
- Fetches from `offers` table
- Clean card layout with expiry badges

**Payment Page (`/payment`)**
- Fetches from `payment_methods` table
- Shows bKash, Nagad, Rocket, Bank etc. with logos and instructions

**Selfcare Page (`/selfcare`)**
- Simple CTA page linking to external portal (URL from site_settings)

**Sales Landing Page (`/get-connected`)**
- Dedicated lead generation page
- Hero + package selection + lead form (Name, Mobile, Area, Address, Package, Payment option)
- Submits to `connection_orders` table
- Clean, high-conversion mobile-optimized design

---

#### Phase 3: Homepage Overhaul — Admin Controlled

**Top Bar** (new component)
- Scrolling notice marquee (from `site_settings.topbar_notice_bn/en`)
- Hotline number (from `site_settings.hotline`)
- Social links

**Navbar** — fetch logo from settings, menu items from `menu_items` table

**Hero** — fetch banner image, title, subtitle, CTA from `site_settings`

**Why Galaxy Net** — fetch from `homepage_features` table

**Services** — keep static or link to services page

**Packages Preview** — fetch featured packages from `packages` table (where featured=true)

**Happy Clients / Testimonials** — fetch from `testimonials` table

**Partners** — fetch from `partners` table, logo slider

**Footer** — fetch contact info from `site_settings`

---

#### Phase 4: Refactor All Public Pages to Use Live Data

- **Packages.tsx** — fetch from `packages` table with 3 tabs: Home / Corporate / Dedicated
- **Coverage.tsx** — fetch from `coverage_areas` table
- **Order.tsx** — fetch packages from DB for dropdown, submit to `connection_orders`
- **Notices.tsx** — fetch from `notices` table
- **Contact.tsx** — fetch contact info from `site_settings`
- **About.tsx** — fetch content from `pages` table (slug: 'about') or keep static with admin-editable settings

---

#### Phase 5: Admin Panel — New Modules

**Offers Manager** (`/admin/offers`)
- CRUD for offers with expiry date, type, active toggle

**Testimonials Manager** (`/admin/testimonials`)
- CRUD for customer reviews

**Partners Manager** (`/admin/partners`)
- Upload logos, reorder, toggle visibility

**Homepage Features Manager** (`/admin/features`)
- CRUD for "Why Galaxy Net" feature cards

**Landing Page / Lead Manager enhancement**
- View leads from sales landing page
- Export CSV

**Settings expansion:**
- Top bar notice text
- Hotline number
- Selfcare URL + enable/disable
- Hero banner upload

---

#### Phase 6: Design Consistency Pass

- Add `TopBar` component above Navbar on all public pages
- Update SpeedTest, Notices pages to use consistent `page-hero` style (currently using old `hero-gradient` style)
- Ensure all pages use `useLanguage()` `t()` consistently
- Add Selfcare, Offers, Payment links to Navbar and Footer

---

### File Changes Summary

| Action | File |
|--------|------|
| Migration | New tables: offers, testimonials, partners, homepage_features + seed site_settings |
| Create | `src/components/TopBar.tsx` |
| Create | `src/pages/Offers.tsx` |
| Create | `src/pages/Payment.tsx` |
| Create | `src/pages/Selfcare.tsx` |
| Create | `src/pages/GetConnected.tsx` (sales landing) |
| Create | `src/pages/admin/OffersManager.tsx` |
| Create | `src/pages/admin/TestimonialsManager.tsx` |
| Create | `src/pages/admin/PartnersManager.tsx` |
| Create | `src/pages/admin/FeaturesManager.tsx` |
| Rewrite | `src/pages/Index.tsx` — all sections fetch from Supabase |
| Rewrite | `src/pages/Packages.tsx` — 3 tabs, fetch from DB |
| Rewrite | `src/pages/Coverage.tsx` — fetch from DB |
| Rewrite | `src/pages/Notices.tsx` — fetch from DB |
| Rewrite | `src/pages/Order.tsx` — fetch packages from DB, submit to DB |
| Edit | `src/pages/Contact.tsx` — fetch contact info from settings |
| Edit | `src/pages/SpeedTest.tsx` — consistent design |
| Edit | `src/components/Navbar.tsx` — add TopBar, new links, fetch menu from DB |
| Edit | `src/components/Footer.tsx` — fetch settings, add new links |
| Edit | `src/components/admin/AdminSidebar.tsx` — add new modules |
| Edit | `src/App.tsx` — add new routes |
| Edit | `src/pages/admin/SettingsPage.tsx` — add topbar, hotline, selfcare fields |

### Implementation Order

1. Database migration (new tables + seed data)
2. TopBar component + Navbar/Footer updates
3. Homepage rewrite (fetch all sections from DB)
4. Refactor Packages, Coverage, Notices, Order, Contact to use live data
5. New pages: Offers, Payment, Selfcare, Sales Landing
6. Admin modules: Offers, Testimonials, Partners, Features managers
7. Settings page expansion
8. Design consistency pass across all pages

