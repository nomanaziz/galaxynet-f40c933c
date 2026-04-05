

## Employee Manager — Image Upload Instead of Photo URL

### Problem
Currently the Employee form uses a plain text input for "Photo URL", requiring admins to manually paste a URL. It should have a proper file upload with preview, like the Offers Manager already does.

### Changes

**File: `src/pages/admin/EmployeeManager.tsx`**

1. Replace the "Photo URL" text input with an image upload zone:
   - Click-to-browse file input (accepts image/*)
   - Upload to Supabase `media` bucket under `employees/` prefix
   - Show image preview with remove button when uploaded
   - Keep a "Paste URL" fallback input below the upload zone
   - Add `uploading` state to disable save while upload is in progress

2. Add `handleImageUpload` function:
   - Validate file type (image/*) and size (max 5MB)
   - Generate unique path: `employees/{timestamp}-{random}.{ext}`
   - Upload via `supabase.storage.from("media").upload()`
   - Get public URL and set it to `form.photo_url`
   - Show toast on error

3. Update the dialog form section (replace the Photo URL input ~line 160):
   - Upload area with dashed border, camera/upload icon, "Click to upload" text
   - If `form.photo_url` is set, show preview image with X button to clear
   - Small text input below for manual URL paste

### No database changes needed
The `media` storage bucket already exists and is public.

### Technical Details
- Reuses the same upload pattern already established in `OffersManager.tsx`
- File path format: `employees/{Date.now()}-{random}.{ext}`
- Max file size: 5MB with client-side validation

