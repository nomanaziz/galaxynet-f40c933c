

## Add Logo Upload Option to FTP Server Manager

### What Changes
In the Add/Edit Server dialog, replace the single "Logo URL" input with a dual option: a file upload button (uploads to Supabase `media` bucket with `ftp-logos/` prefix) AND a URL text input. The uploaded file's public URL auto-fills the logo_url field. Both methods set the same `logo_url` value.

### Files to Modify
- **`src/pages/admin/FtpServerManager.tsx`**
  - Add `Upload` icon import from lucide-react
  - Add `uploading` state for loading indicator
  - Add `handleLogoUpload` function that uploads to `media` bucket under `ftp-logos/` prefix, gets public URL, sets `editing.logo_url`
  - Replace the Logo URL input section with:
    - A file input button (hidden input + styled Button trigger) labeled "Upload Logo"
    - An "or" separator
    - The existing URL text input
    - A small preview thumbnail if logo_url is set
  - No database changes needed (uses existing `media` bucket which is already public)

### Technical Details
- Upload path: `media` bucket → `ftp-logos/{timestamp}_{filename}`
- Uses `supabase.storage.from('media').upload(...)` then `getPublicUrl(...)`
- Shows upload progress via disabled state on button
- Preview: small 40x40 rounded image when logo_url is populated

