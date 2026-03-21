

## Rename "Featured" to "Show on Homepage" Toggle

The system already works correctly — the homepage queries `featured=true` packages, and the admin has a `Featured` toggle. The only change needed is **renaming the label** from "Featured" to "Show on Homepage" so the admin understands it controls homepage visibility.

### Changes

**`src/pages/admin/PackageManager.tsx`**
- Table header: "Featured" → "Homepage"
- Table row toggle: keep same `featured` field, just relabel
- Dialog: "Featured" label → "Show on Homepage"

**`src/pages/Index.tsx`**
- Remove the `limit(4)` on the featured packages query so ALL packages marked "Show on Homepage" appear (admin has full control)

No database changes needed — the `featured` boolean column already serves this purpose.

