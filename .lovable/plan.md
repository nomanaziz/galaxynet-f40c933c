

## Remove "Free Router" from Packages Page

**What**: Remove the "ফ্রি রাউটার / Free Router" label that appears on every plan card in the Packages page.

**Change in `src/pages/Packages.tsx`**:
- Delete lines 27-30 (the `<div>` with the Wifi icon and "Free Router" text)
- Remove the unused `Wifi` import from lucide-react (line 1)

That's it — only one file, one location.

