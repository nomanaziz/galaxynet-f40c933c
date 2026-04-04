

## Mobile-Friendly Fixes (5 Issues)

### 1. Footer — 2-column layout on mobile
Change the footer grid from `grid-cols-1` to `grid-cols-2` on mobile, keeping 4 columns on desktop. The Brand column and Contact column will span full width, while Quick Links and Resources sit side by side.

**File**: `src/components/Footer.tsx`
- Change grid to `grid-cols-2 md:grid-cols-2 lg:grid-cols-4`
- Brand column: `col-span-2 md:col-span-1`
- Contact column: `col-span-2 md:col-span-1`
- Quick Links and Resources: each takes 1 column naturally
- Reduce padding/gap on mobile

### 2. Navbar — prevent flash/invisible state on load
The navbar menu items load from Supabase, so the nav is empty until the fetch completes. Add a loading skeleton or reserve space so the navbar doesn't jump/appear empty.

**File**: `src/components/Navbar.tsx`
- Show minimal skeleton placeholders in the desktop nav while `menuItems` is empty and still loading
- This prevents the "invisible navbar" feel

### 3. Packages — smaller cards on mobile
Package cards are currently `grid-cols-1` on small screens which makes them full-width and tall. Switch to a 2-column grid on mobile.

**File**: `src/pages/Packages.tsx`
- Change grid from `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` to `grid-cols-2 lg:grid-cols-4`
- Reduce card padding from `p-6` to `p-3 sm:p-6`
- Reduce font sizes inside PlanCard for mobile (text-lg instead of text-xl for name, text-2xl instead of text-3xl for speed)

### 4. General mobile-friendliness
- Reduce section padding on mobile across pages (`py-16` → `py-8 sm:py-16`)
- Ensure TabsList on packages page doesn't overflow horizontally on small screens (add `flex-wrap` or horizontal scroll)

**File**: `src/pages/Packages.tsx`

### 5. Duplicate close button in mobile menu
The `SheetContent` component has a built-in close button (X icon at top-right, line 60-63 of sheet.tsx). The Navbar also adds its own close button inside the sheet header (lines 202-206). This causes two X buttons.

**File**: `src/components/Navbar.tsx`
- Remove the manual `SheetClose` button from the mobile menu header (lines 202-206)
- The built-in SheetContent close button handles closing already

### Files to modify
1. `src/components/Footer.tsx` — 2-column mobile grid
2. `src/components/Navbar.tsx` — remove duplicate close button, add loading state
3. `src/pages/Packages.tsx` — 2-column mobile grid, smaller cards, responsive padding

