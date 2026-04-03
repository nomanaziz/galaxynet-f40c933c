

## Plan: Cache Marquee Redesign, Footer Gradient, New Connection Landing Page & Admin Enhancements

### 1. Redesign Cache Marquee with Real Logos (Reference: image-6)

**File: `src/components/home/CacheMarquee.tsx`**
- Replace plain text names with styled brand logos using proper brand fonts/colors (Meta blue, TikTok black, Steam icon, Netflix red, Google multi-color, BaishanCloud, Edgenext, Apple)
- Add a purple badge label "দেশের সবচেয়ে বেশি ক্যাশ সার্ভার" (like the reference)
- Use a light cream/beige background instead of `bg-secondary/80`
- Smooth infinite scroll animation (already exists, refine speed)

### 2. Add Gradient Strip Above Footer (Reference: image-7)

**File: `src/components/Footer.tsx`**
- Add a gradient bar section above the footer with service icons (Fast Internet, 4K TV, Gamers, Internet Fiber, Promo, Support)
- Use the purple-to-orange gradient from the reference image (`gradient-orange-strip` or new similar gradient)
- Icons in white circles with orange icon color, labels below in white text
- Mobile: horizontal scroll or 3x2 grid

### 3. Create New Connection Landing Page (`/new-connection`)

**New file: `src/pages/NewConnection.tsx`**
- Standalone landing page designed for boosting/marketing links (no Navbar/Footer for cleaner conversion focus, or minimal header with just logo)
- Form fields based on reference image (image-8):
  - আপনার নাম (Name) *
  - এলাকা নির্বাচন করুন (Area selection) * — dropdown from `coverage_locations`
  - আপনার ঠিকানা (Address) — বাসা নং / রোড নং
  - ফোন নাম্বার (Phone) * — 11 digit
  - ইমেইল এড্রেস (optional)
  - কোন সার্ভিস সম্পর্কে জানতে চান? (Which service?) — radio: নতুন কানেকশন, এফটিপি সার্ভার, কাস্টমার সাপোর্ট, শিফটিং, ধীর গতি, রেফার
  - আপনার এনআইডি নাম্বার (NID number) — optional
  - আপনার জন্ম তারিখ (Date of birth) — optional
- Submit button: "ফর্ম সাবমিট করুন" with gold/accent color
- Data saves to `connection_orders` table (using `notes` field for extra data like NID, DOB, service type)
- Success screen after submission
- Mobile-first, clean, modern design

**File: `src/App.tsx`**
- Add route `/new-connection` pointing to `NewConnection`

### 4. Expand Order Status Enum & Admin Order Manager

**Database migration:**
- Add new enum values to `order_status`: `accepted`, `out_of_coverage`, `cancelled`
- This gives statuses: `pending`, `contacted`, `accepted`, `out_of_coverage`, `completed`, `cancelled`

**File: `src/pages/admin/OrderManager.tsx`**
- Add summary stats cards at top showing counts: Total, Pending, Accepted, Out of Coverage, Completed
- Update status dropdown to include all new statuses with appropriate color badges
- Add date column showing when the order was submitted
- Add filter by status
- Update `statusColor` function for new statuses (accepted=green, out_of_coverage=red, cancelled=gray)

**File: `src/integrations/supabase/types.ts`**
- Update `order_status` enum type to include new values

### 5. Smooth Scrolling

**File: `src/index.css`**
- Add `scroll-behavior: smooth` to `html` element for smooth page scrolling

### Technical Summary

| File | Change |
|------|--------|
| `src/index.css` | Add `scroll-behavior: smooth` to html |
| `src/components/home/CacheMarquee.tsx` | Redesign with brand-styled logos, cream bg, purple badge |
| `src/components/Footer.tsx` | Add gradient icon strip above footer |
| `src/pages/NewConnection.tsx` | New landing page with form matching reference |
| `src/App.tsx` | Add `/new-connection` route |
| `src/pages/admin/OrderManager.tsx` | Add stats cards, new statuses, date column, status filter |
| `src/integrations/supabase/types.ts` | Update order_status enum |
| Migration SQL | Add `accepted`, `out_of_coverage`, `cancelled` to order_status enum |

