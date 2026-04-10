

## Fix Build Errors + Add District-wise Grouping to Coverage Page

### Part 1: Fix Build Errors (all pages)

The `</div>` closing tags at the end of page components were not properly converted to `</>` (React fragments) during the layout migration. This causes "Identifier expected" errors across all affected pages.

**Files to fix** (replace final `</div>` with `</>`):
- `src/pages/Coverage.tsx` (lines 350, 364)
- `src/pages/About.tsx`
- `src/pages/Contact.tsx`
- `src/pages/Index.tsx`
- `src/pages/Login.tsx`
- `src/pages/Notices.tsx`
- `src/pages/Offers.tsx`
- `src/pages/Order.tsx`
- `src/pages/Packages.tsx`
- `src/pages/Payment.tsx`
- `src/pages/Register.tsx`
- `src/pages/Selfcare.tsx`
- `src/pages/Services.tsx`
- `src/pages/SpeedTest.tsx`

### Part 2: Add District-wise Grouping on Coverage Page

Currently, areas are grouped only by Division. The change adds a second level of grouping by District within each Division.

**New data structure:**
```text
Division Header (e.g. "Dhaka Division")
  ├── District Sub-header (e.g. "Dhaka" with area count badge)
  │   ├── Area Card 1
  │   ├── Area Card 2
  │   └── ...
  ├── District Sub-header (e.g. "Gazipur")
  │   ├── Area Card 1
  │   └── ...
  └── ...
```

**Changes to `src/pages/Coverage.tsx`:**
- Replace `groupedByDivision` with a two-level grouping: Division > District > Areas
- Each Division section shows a styled header (existing design)
- Under each Division, add District sub-headers with emoji icon, district name, and area count badge
- Area cards grid renders under each district sub-header
- When a specific district is selected in the filter, division headers are hidden and only district sub-headers show
- Collapsible/accordion behavior is not needed -- all districts are expanded by default

**Visual layout:**
```text
──── Dhaka Division (45) ────
  🕌 Dhaka (12)
  [card] [card] [card] ...

  🏭 Gazipur (8)
  [card] [card] [card] ...

──── Chattogram Division (20) ────
  ⛰️ Chattogram (15)
  [card] [card] ...
```

### Technical Details

- The `groupedByDivision` memo will be replaced with a `groupedByDivisionAndDistrict` memo that produces: `{ division, districts: { district, areas }[] }[]`
- Uses existing `getAncestorOfType` to resolve each area's district
- No database changes needed -- all data already exists in the hierarchy

