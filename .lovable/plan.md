

## Fix: Hide Expired Offers from Public Page

### Problem
Currently, expired offers (where `expiry_date` has passed) still show in the list with reduced opacity. Offers without an `expiry_date` (lifetime offers) should always show. Expired offers should be hidden entirely.

### Change in `src/pages/Offers.tsx`

Filter out expired offers after fetching, keeping only:
- Offers with no `expiry_date` (lifetime/permanent offers)
- Offers where `expiry_date` is in the future

**Line 23-26**: After fetching data, filter before setting state:
```typescript
const now = new Date();
const active = (data ?? []).filter(o => !o.expiry_date || new Date(o.expiry_date) >= now);
setOffers(active);
```

Also remove the `opacity-50` expired styling on line 57 since expired offers will no longer appear.

Single file change: `src/pages/Offers.tsx`

