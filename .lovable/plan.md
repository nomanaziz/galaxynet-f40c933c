

## Plan: Mobile Bottom Nav + Floating CTA Button

### 1. Mobile Bottom Navigation Bar
Create a new `BottomNav.tsx` component — a fixed bottom navigation bar visible only on mobile screens. It will include quick-access links including **Services** and **About**, plus other key pages.

**Design**: Fixed at the bottom of the screen, 5 icons in a row (Home, Services, About, Packages, Contact), with labels underneath. Only visible on `md:hidden`.

**File**: `src/components/BottomNav.tsx`
- Fixed bottom bar with `z-40`, background blur
- 5 nav items with icons and small labels (both EN/BN)
- Active state highlighting based on current route
- Hidden on desktop (`md:hidden`)

**Integration**: Add `<BottomNav />` to `src/components/Layout.tsx`

### 2. Floating "Get Connection" CTA Button
Create a new `FloatingCTA.tsx` component — a floating action button on the right side that links to `/new-connection`.

**Design**: Positioned on the right side (opposite to the WhatsApp button on the left). Accent-colored with a pulse animation. Text: "আজকেই কানেকশন নাও" / "Get Connected Today".

**File**: `src/components/FloatingCTA.tsx`
- Fixed position: `bottom-20 right-4 md:bottom-6 md:right-6`
- Accent gradient background with pulse animation (similar style to WhatsApp button)
- Links to `/new-connection`
- Bilingual text support

**Integration**: Add `<FloatingCTA />` to `src/components/Layout.tsx`

### 3. Adjust WhatsApp Button Position
Move the WhatsApp floating button up slightly on mobile to avoid overlapping with the new bottom nav bar.

### Files to Create
- `src/components/BottomNav.tsx`
- `src/components/FloatingCTA.tsx`

### Files to Modify
- `src/components/Layout.tsx` — add both new components
- `src/components/FloatingWhatsApp.tsx` — adjust mobile position to avoid bottom nav overlap

