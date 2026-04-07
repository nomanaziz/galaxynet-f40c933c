

## Two Changes: WhatsApp Button Repositioning + Area Selection Hierarchy

### 1. WhatsApp Floating Button — Move to Left Side

**File: `src/components/FloatingWhatsApp.tsx`**
- Change position classes from `right-4 md:right-6` to `left-4 md:left-6`
- Keep the same bottom positioning

**File: `src/components/ScrollToTopButton.tsx`**
- Adjust position to avoid overlap — keep on right side (already there), no conflict

### 2. New Connection Area Selector — Hierarchical with Search

Currently the form loads ALL `coverage_locations` (694 records including disabled ones) into a flat dropdown. This needs to become a cascading hierarchy that only shows enabled locations.

**File: `src/pages/NewConnection.tsx`**

Replace the single area `<Select>` with a cascading set of selects + search:

- **Data fetch**: Load all `coverage_locations` with `enabled = true`, ordered by `sort_order, name`. Also use the `coverageHierarchy.ts` utilities to filter out locations whose ancestors are disabled.
- **State**: Add `selectedDivision`, `selectedDistrict`, `selectedThana` states. The final `area` value sent to the form will be the name of the most specific selection (thana name, or district if no thana).
- **UI flow**:
  1. **Division select** — pre-selected to "Dhaka" (the only enabled division). Shows only enabled divisions.
  2. **District select** — shows enabled districts under selected division. Includes a search/filter input above the list.
  3. **Thana select** — shows enabled thanas under selected district. Includes a search/filter input.
- **Search**: Use the shadcn `Command` (combobox) pattern or a simple text input filter above `SelectContent` to let users type and filter the list. A simpler approach: add a search `Input` that filters the dropdown items inline.
- **Area value**: When submitting, store the selected thana (or district) name as the `area` field, matching current behavior.

**Layout of the new area section:**
```text
┌─────────────────────────────────────┐
│ বিভাগ (Division)                    │
│ [Dhaka ▼]  (pre-selected, only 1)  │
├─────────────────────────────────────┤
│ জেলা (District)                     │
│ [🔍 Search...]                      │
│ [Select district ▼]                │
├─────────────────────────────────────┤
│ থানা/উপজেলা (Thana)                │
│ [🔍 Search...]                      │
│ [Select thana ▼]                   │
└─────────────────────────────────────┘
```

**Key details:**
- Use existing `buildLocationMap`, `isAncestorDisabled` from `src/lib/coverageHierarchy.ts` to compute effective visibility
- Only enabled divisions/districts/thanas appear in dropdowns
- Search is a controlled text input that filters the Select items by name/name_bn
- Pre-select Dhaka division since it's the only enabled one
- When division changes, reset district and thana; when district changes, reset thana

### Files to modify
- `src/components/FloatingWhatsApp.tsx` — move to left
- `src/pages/NewConnection.tsx` — hierarchical area selector with search

