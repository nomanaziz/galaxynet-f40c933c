

## Fix 3 Issues: Popular Badge, Order Management, Offers Page

### Issue 1: Separate "Popular" Badge from "Show on Homepage"

Currently, the homepage shows a "POPULAR" badge on every package that has `featured=true`. The `featured` field controls both homepage visibility AND the popular badge — they should be independent.

**Database migration:** Add `popular` boolean column (default false) to `packages` table.

**Files to change:**
- `src/pages/Index.tsx` — Show "POPULAR" badge only when `pkg.popular` is true (not `pkg.featured`)
- `src/pages/admin/PackageManager.tsx` — Add "Popular" toggle in table and dialog form (separate from "Show on Homepage")
- `src/pages/Packages.tsx` — Show "POPULAR" badge based on `pkg.popular` instead of `pkg.featured`

### Issue 2: Order Manager — Add Delete + Bulk Actions

**No database changes needed** — delete RLS policy already exists.

**Rewrite `src/pages/admin/OrderManager.tsx`:**
- Add checkbox column for row selection (select all / individual)
- Add bulk action bar: bulk status change dropdown + bulk delete button
- Add individual delete button per row
- Add delete confirmation dialog
- Add notes/assigned_to display

### Issue 3: Offers Page Not Working

The `OffersManager.tsx` has a function named `fetch` that shadows the global `fetch` API — this can cause subtle issues.

**Fix `src/pages/admin/OffersManager.tsx`:**
- Rename the `fetch` function to `fetchOffers` (same pattern as other managers)

**Verify `src/pages/Offers.tsx`:** Code is correct, no changes needed. If offers exist with `active=true`, they will display.

### Summary of Changes

| File | Change |
|------|--------|
| Migration | Add `popular` boolean to `packages` |
| `src/pages/Index.tsx` | Badge uses `pkg.popular` not `pkg.featured` |
| `src/pages/Packages.tsx` | Badge uses `pkg.popular` not `pkg.featured` |
| `src/pages/admin/PackageManager.tsx` | Add "Popular" toggle column + dialog field |
| `src/pages/admin/OrderManager.tsx` | Rewrite with checkboxes, bulk actions, delete |
| `src/pages/admin/OffersManager.tsx` | Rename `fetch` → `fetchOffers` |

