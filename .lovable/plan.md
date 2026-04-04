

## BTRC Approved Tariff PDF Download Feature

### Overview
Add a "BTRC Approved Tariff" link in both the TopBar and Footer. Admin can upload a PDF file via the admin panel, and users can download it by clicking the link.

### Changes

**1. Admin Settings — Add BTRC Tariff Upload Section**

**File**: `src/pages/admin/SettingsPage.tsx`
- Add a new "BTRC Tariff" card section with a file upload input (accept PDF only)
- On upload, store the PDF in the existing `media` Supabase storage bucket with a fixed name like `btrc-tariff.pdf`
- Save the public URL to `site_settings` table with key `btrc_tariff_url`
- Show the current file link if one exists, with a replace/delete option

**2. TopBar — Add BTRC Tariff Link**

**File**: `src/components/TopBar.tsx`
- Read `btrc_tariff_url` from the settings already fetched
- Add a small download link icon (FileText or Download icon) next to the hotline, labeled "BTRC Tariff"
- Link opens the PDF URL in a new tab (target="_blank")
- Only show if `btrc_tariff_url` has a value

**3. Footer — Add BTRC Tariff Link**

**File**: `src/components/Footer.tsx`
- Add "BTRC Approved Tariff" to the Resources links list
- Instead of a React Router `<Link>`, use an `<a>` tag with `target="_blank"` pointing to the PDF URL from `site_settings`
- Read `btrc_tariff_url` from the already-fetched settings

### No Database Migration Needed
- Uses existing `site_settings` table (key: `btrc_tariff_url`)
- Uses existing `media` storage bucket for the PDF file

### Technical Details
- PDF uploaded to `media` bucket as `btrc-tariff.pdf` (overwrites on re-upload)
- Public URL stored in `site_settings` with key `btrc_tariff_url`
- TopBar and Footer both already fetch `site_settings` on mount — just read the new key
- Admin upload uses `supabase.storage.from("media").upload()` with `upsert: true`

