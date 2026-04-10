

## Three Changes: Pay Bill Mobile Fix + Banners + Merge Order/NewConnection

### 1. Pay Bill (`/pay-bill`) Mobile Fix and Enhancement

**Problem**: Quick Pay banner drops to the bottom on mobile. bKash should be highlighted. Page needs better mobile layout.

**Changes in `src/pages/Payment.tsx`**:
- Add a `PageHeroDark` hero banner at the top (matching other pages)
- Restructure Quick Pay banner for mobile: stack vertically with full-width PAY NOW button, ensure it stays at the top
- Make the "How to Pay" grid `grid-cols-2` on mobile (already is), but reduce padding
- Highlight bKash in mobile banking tabs: if bKash is present, auto-select it as default tab and give it a prominent style
- Fix mobile banking tab overflow: make tabs horizontally scrollable on small screens
- Reduce section padding on mobile (`py-8` instead of `py-12`)

### 2. Add PageHeroDark Banner to `/pay-bill` and `/offers`

Both pages currently lack a proper hero banner like other pages have.

**`src/pages/Payment.tsx`**: Add `<PageHeroDark>` with title "Pay Bill" / "বিল পরিশোধ" and a suitable bg image
**`src/pages/Offers.tsx`**: Add `<PageHeroDark>` with title "Offers" / "অফার সমূহ" and a suitable bg image

### 3. Replace `/order` with `/new-connection` (Merge Pages)

**Goal**: Remove the separate Order page. The `/new-connection` page (currently a standalone landing page outside Layout) becomes the only connection form, but placed inside the Layout (with Navbar/Footer) at the route `/new-connection`.

**Changes**:
- **`src/App.tsx`**:
  - Remove `Order` import and `/order` route
  - Move `/new-connection` route inside `<Route element={<Layout />}>` so it gets Navbar/Footer
  - Add redirect: `/order` → `/new-connection` using `<Navigate>`
- **`src/pages/NewConnection.tsx`**:
  - Remove the standalone header (logo + home link) since Layout provides Navbar
  - Add `PageHeroDark` banner at the top
  - Keep the dark-themed form card but adapt it to work within Layout (remove `min-h-screen` and the gradient background wrapper, use a section with the dark gradient instead)
  - Keep all form functionality (hierarchical area selection, package tabs, dedicated Mbps)
- **`src/pages/Order.tsx`**: Delete this file (no longer needed)
- **`src/components/Footer.tsx`**: Update link from `/order` to `/new-connection`
- **Admin sidebar/routes**: Keep `/admin/orders` as-is (it manages submitted orders, unaffected)

### Files to Modify
- `src/pages/Payment.tsx` — mobile fix, add hero banner, highlight bKash
- `src/pages/Offers.tsx` — add hero banner
- `src/pages/NewConnection.tsx` — adapt to work inside Layout
- `src/App.tsx` — remove Order route, move NewConnection inside Layout, add redirect
- `src/components/Footer.tsx` — update link

### File to Delete
- `src/pages/Order.tsx`

