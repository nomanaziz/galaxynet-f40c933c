

## Fix: Offers Not Displaying After Creation

### Root Cause

The OffersManager has two problems:

1. **No error handling** — Both `insert` and `select` calls ignore errors. The toast shows "Offer created" even if the insert fails due to RLS or data issues. The fetch silently returns `[]` if there's an error.

2. **Empty strings sent for nullable fields** — Fields like `expiry_date` (date type) and `image_url` receive `""` instead of `null`. An empty string is invalid for a PostgreSQL `date` column, causing silent insert failures. Similarly, the fetch may fail if the RLS check encounters issues.

Data exists in the DB (1 offer found), so the SELECT query is likely being blocked on the client. This points to the Supabase client's auth session not being properly recognized during the fetch, or the query erroring silently.

### Fix in `src/pages/admin/OffersManager.tsx`

1. **Add error handling** to `handleSave` — check `error` from insert/update, show error toast if it fails, only show success if it succeeds
2. **Add error handling** to `fetchOffers` — log/check errors from select
3. **Sanitize form data before save** — convert empty strings to `null` for nullable fields (`image_url`, `expiry_date`, `description`, `description_bn`, `title_bn`)
4. **Add `DialogDescription`** to fix the console warning about missing description

Single file change: `src/pages/admin/OffersManager.tsx`

