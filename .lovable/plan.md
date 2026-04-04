

## Coverage Page: Sorting & Decorative Area Cards

### Problem
1. Coverage area boxes display in flat alphabetical order — not organized by Division > District > Thana hierarchy
2. Area boxes look plain — just a pin icon and text, no visual identity

### Changes

**1. Hierarchical Sorting (`src/pages/Coverage.tsx`)**
- Sort the `filtered` array by: Division sort_order → District sort_order → Thana sort_order
- Walk up each area's `location_id` ancestor chain to get division/district/thana sort values
- Dhaka Division will naturally come first (sort_order=1 from seed data), then Chattogram, Rajshahi, etc.
- Within each division, districts sorted alphabetically/by sort_order, then thanas within each district
- Add visual **Division group headers** between groups (e.g., "ঢাকা বিভাগ", "চট্টগ্রাম বিভাগ") so users can scan quickly

**2. Decorative Area Cards (`src/pages/Coverage.tsx`)**
- Create a mapping of ~64 district-level decorative icons/patterns using emoji or simple SVG motifs representing famous landmarks:
  - Dhaka: mosque/monument, Chattogram: hill/ship, Sylhet: tea leaf, Rajshahi: mango, Khulna: sundarbans/tiger, Barisal: river/boat, Rangpur: tobacco/temple, Mymensingh: bridge
  - Each district gets a unique subtle icon
- Each area card gets a **faded background icon** in the bottom-right corner (opacity ~8-12%, large size) based on its parent district
- The icon creates a watermark-like decoration without interfering with readability
- Cards also get a subtle **left border color** per division (8 distinct colors) for visual grouping

**3. Card Layout Enhancement**
- Slightly increase card padding
- Show district name as a small colored chip below the area name
- The breadcrumb stays but becomes more compact

### Files to Modify
1. `src/pages/Coverage.tsx` — sorting logic, grouped rendering, decorative cards
2. `src/lib/coverageHierarchy.ts` — add helper to get ancestor at a specific level (e.g., get division for an area)

### Technical Details
- District icon mapping: a static object mapping district names to emoji characters (🕌 🏔️ 🍵 🥭 🐅 🚣 🌾 🌉 etc.)
- Division color mapping: 8 CSS colors for left-border accent per division
- Sorting uses a composite key built from ancestor chain sort_orders
- No database changes needed

