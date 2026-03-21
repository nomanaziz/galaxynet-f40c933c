

## Galaxy Net — Complete UI/UX Redesign + Language System + Admin CMS Enhancements

This plan covers a full frontend redesign with a modern, clean, premium look — plus a Bangla/English language system and admin CMS improvements.

---

### 1. Language System (Foundation — Build First)

Create a lightweight i18n context that all components consume.

- **New file:** `src/contexts/LanguageContext.tsx` — React context with `language` (bn/en), `setLanguage`, and a `t()` helper
- **New file:** `src/i18n/translations.ts` — all UI strings in `{ en: "...", bn: "..." }` format
- Default language: **Bangla**
- Persist selection in `localStorage`
- Language switcher component: simple toggle button (বাং / EN) placed in the Navbar

---

### 2. Navbar — Full Redesign

Replace the current navbar with a clean, modern sticky header:

- **Left:** Logo (icon + "Galaxy Net")
- **Center:** Nav links — Home, Packages, Services, Coverage, About, Contact
- **Right:** Language switcher toggle + "Contact Us" CTA button (replaces "Order Now")
- **Dropdown support:** Services menu item gets a dropdown (Broadband, Corporate, CCTV, Networking)
- **Mobile:** Clean hamburger menu with slide-in sheet, smooth animation
- **Remove:** "Order Now" button from navbar entirely
- Cleaner spacing, no dual-language labels in nav links (use selected language only)
- Subtle bottom border/shadow instead of heavy color block

---

### 3. Hero Section — Full Redesign (Homepage)

Replace the current hero with a modern split layout:

- **Left side:**
  - Strong headline in selected language (e.g., "আপনার এলাকায় সেরা ফাইবার ইন্টারনেট" / "Best Fiber Internet in Your Area")
  - Short description paragraph
  - Two CTA buttons: "Check Coverage" (primary) + "Contact Us" (outline)
  - Remove: "Order Now", "Get Connection" buttons
  - Remove: BDIX/FTP badge row from hero
- **Right side:**
  - Abstract ISP illustration using CSS/SVG (fiber optic network visual, gradient circles, connecting dots pattern)
- **Background:** Subtle gradient with soft pattern overlay, not the heavy blue block
- **Animation:** Fade-up on load for text, slide-in for illustration

---

### 4. Homepage Sections Redesign

Rebuild each section with cleaner design:

- **Trust Stats Bar:** Softer background, larger numbers, subtle card style
- **Why Choose Us:** Cleaner cards with more whitespace, subtle hover lift effect
- **Services Preview:** Horizontal scroll on mobile, clean icon cards
- **Popular Packages:** Remove "Order Now" buttons, replace with "View Details" linking to `/packages` and "Contact" linking to `/contact`
- **Coverage CTA:** Cleaner design with illustration
- **Testimonials:** Cleaner quote cards with avatar initials
- **Bottom CTA:** Replace "Order Now" with "Contact Us" / "Check Coverage"

---

### 5. Packages Page Redesign

- Clean card-based layout, more whitespace
- Replace all "Order Now" buttons with "View Details" or "Contact Us"
- Cleaner speed filter UI
- Better typography hierarchy (speed prominently displayed, price secondary)

---

### 6. Coverage Page Redesign

- Cleaner search/dropdown UI
- When available: show "Contact Us" button (not "Order Now")
- When not available: show "Request Connection" linking to contact

---

### 7. Other Pages (About, Contact, Services)

- Apply consistent design system across all pages
- Cleaner page heroes (lighter, less heavy gradient)
- Better card spacing and typography
- Remove any remaining "Order Now" references

---

### 8. Footer Redesign

- Clean 4-column layout
- Better typography and spacing
- Quick links use selected language only
- Social icons row

---

### 9. Remove "Order Now" Elements

- Remove `StickyOrderBar.tsx` component (fixed bottom bar)
- Remove "Order Now" from floating elements
- Keep the `/order` page accessible but don't prominently push it
- Replace all "Order Now" CTAs with "Contact Us" or "View Details"

---

### 10. Admin Panel CMS Enhancements

**New admin modules (database tables already exist):**

- **Menu Management** (`/admin/menu`) — Add/edit/reorder menu items, link to pages
- **Payment Method Management** (`/admin/payments`) — CRUD for bKash, Nagad, Bank payment methods
- **Homepage Section Editor** (`/admin/homepage`) — Edit hero text, CTA text, feature highlights from admin (store in `site_settings` with section-specific keys)
- **Media Manager** (`/admin/media`) — Create a Supabase storage bucket, upload/browse images

**Database changes needed:**
- New `menu_items` table (already in schema plan but not created yet): `id`, `label`, `label_bn`, `url`, `parent_id`, `sort_order`, `visible`
- Storage bucket for media uploads

---

### File Changes Summary

| Action | File |
|--------|------|
| Create | `src/contexts/LanguageContext.tsx` |
| Create | `src/i18n/translations.ts` |
| Rewrite | `src/components/Navbar.tsx` |
| Rewrite | `src/components/Footer.tsx` |
| Rewrite | `src/pages/Index.tsx` |
| Rewrite | `src/pages/Packages.tsx` |
| Rewrite | `src/pages/Coverage.tsx` |
| Rewrite | `src/pages/About.tsx` |
| Rewrite | `src/pages/Contact.tsx` |
| Rewrite | `src/pages/Services.tsx` |
| Edit | `src/pages/Order.tsx` — update CTAs, cleaner design |
| Delete | `src/components/StickyOrderBar.tsx` |
| Edit | `src/App.tsx` — remove StickyOrderBar, wrap with LanguageProvider |
| Edit | `src/index.css` — updated design tokens, softer gradients |
| Edit | `tailwind.config.ts` — new animations (fade-up, slide-in) |
| Create | `src/pages/admin/MenuManager.tsx` |
| Create | `src/pages/admin/PaymentManager.tsx` |
| Create | `src/pages/admin/HomepageEditor.tsx` |
| Create | `src/pages/admin/MediaManager.tsx` |
| Edit | `src/components/admin/AdminSidebar.tsx` — add new menu items |
| Edit | `src/App.tsx` — add new admin routes |
| Migration | Create `menu_items` table + storage bucket |

---

### Implementation Order

1. Language system (context + translations)
2. Navbar redesign
3. Hero section redesign
4. Homepage sections redesign
5. Packages, Coverage, About, Contact, Services page redesigns
6. Footer redesign
7. Remove StickyOrderBar + "Order Now" references
8. Admin CMS enhancements (menu, payments, homepage editor, media)
9. Database migration for menu_items + storage bucket

