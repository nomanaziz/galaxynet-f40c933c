

## Add Video Link for Mobile Banking Payment Methods

### What Changes
Add a `video_url` column to the `payment_methods` table so each mobile banking method can have an optional tutorial video. Display it as an embedded YouTube video (or link) in the mobile banking tab content on the Payment page. Allow admins to set the video URL in PaymentManager.

### Database Migration
- Add `video_url text` column to `payment_methods` table

### File Changes

**`src/pages/Payment.tsx`**
- In the mobile banking tab content (after instructions/screenshot), render an embedded YouTube video if `activeMethod.video_url` is set
- Extract YouTube video ID from URL and render in a 16:9 aspect ratio iframe
- Show a "Watch Tutorial" label above the video

**`src/pages/admin/PaymentManager.tsx`**
- Add `video_url` field to `emptyForm`
- Add a "Video URL (YouTube)" input field in the payment method form dialog

### Layout
```text
Mobile Banking Tab Content:
┌──────────────────────────────────────────┐
│  Instructions text    │  Screenshot      │
│  Account number       │                  │
├───────────────────────┴──────────────────┤
│  ▶ Watch Tutorial Video                  │
│  ┌──────────────────────────────────┐    │
│  │  YouTube Embed (16:9)            │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

### Files to modify
- Create migration: add `video_url` to `payment_methods`
- `src/pages/Payment.tsx`
- `src/pages/admin/PaymentManager.tsx`

