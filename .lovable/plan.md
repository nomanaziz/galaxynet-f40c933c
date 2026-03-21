

## Hierarchical Coverage Management + Bulk Actions

### Database Changes

**New table: `coverage_locations`**
- `id` uuid PK
- `name` text (EN)
- `name_bn` text (BN)
- `type` enum (`district` / `thana` / `zone`) — new `coverage_location_type` enum
- `parent_id` uuid FK → self (nullable). District = no parent, Thana → District, Zone → Thana
- `sort_order` int default 0
- `created_at` timestamptz

**Modify `coverage_areas`:**
- Add `location_id` uuid FK → `coverage_locations` (nullable, for backward compat)

**RLS:** Public SELECT, admin CRUD (same pattern as other tables).

### Admin UI — Rewrite `CoverageManager.tsx`

**Two tabs:**

1. **Locations Tab** — Hierarchical tree management
   - Collapsible tree: District → Thana → Zone
   - "Add District" top-level button
   - Within each district: "Add Thana" button
   - Within each thana: "Add Zone" button
   - Edit/Delete inline for each node
   - Each node shows name, name_bn, type badge

2. **Areas Tab** — Existing coverage areas with enhancements
   - Cascading dropdowns (District → Thana → Zone) replace free-text fields in add/edit dialog
   - Checkbox selection column on each row
   - **Bulk action toolbar** (appears when items selected):
     - "Mark Available" — bulk toggle available=true
     - "Mark Unavailable" — bulk toggle available=false
     - "Delete Selected" — bulk delete with confirmation
     - "Select All / Deselect All"

### Frontend — Update `Coverage.tsx`

- Replace flat zone filter buttons with cascading dropdowns: District → Thana → Zone
- Fetch `coverage_locations` to build filter hierarchy
- Show breadcrumb for each area (e.g., "Dhaka > Mirpur > Mirpur-10")

### Files

| Action | File |
|--------|------|
| Migration | Create enum, `coverage_locations` table, add `location_id` to `coverage_areas`, RLS |
| Rewrite | `src/pages/admin/CoverageManager.tsx` — tabs, tree view, bulk actions |
| Edit | `src/pages/Coverage.tsx` — cascading filters, breadcrumbs |

