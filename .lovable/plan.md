## Add Google Analytics 4 + Search Engine Verification

Make both manageable from the **Admin → Settings** page so you can paste IDs anytime without code changes.

### What I'll add
3 new keys in `site_settings`:
- `ga_measurement_id` — paste your `G-XXXXXXXXXX`
- `google_site_verification` — paste the `content` value from Search Console's HTML tag method
- `bing_site_verification` — optional, for Bing Webmaster

### Files

**1. `src/components/SeoHead.tsx` (new)**
- Mounted once at app root.
- Reads the 3 keys from `site_settings`.
- If `ga_measurement_id` is a valid `G-...` ID → injects the GA4 `gtag.js` loader + init script into `<head>`.
- If `google_site_verification` is set → upserts `<meta name="google-site-verification" content="...">`.
- If `bing_site_verification` is set → upserts `<meta name="msvalidate.01" content="...">`.

**2. `src/App.tsx`**
- Mount `<SeoHead />` inside `BrowserRouter`.

**3. `src/pages/admin/SettingsPage.tsx`**
- Add a new "SEO & Analytics" section with the 3 input fields, included in `allKeys` so Save persists them.

### After deploy (you'll do)
1. Admin → Settings → SEO & Analytics → paste IDs → Save.
2. In Search Console, choose "HTML tag" method, paste only the `content="..."` value, then click Verify.
3. GA4 starts collecting traffic immediately on page load.

No DB migration needed — `site_settings` already supports arbitrary keys.
