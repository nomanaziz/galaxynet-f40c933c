

## Mobile Optimizations for Homepage Sections

### Changes to `src/pages/Index.tsx`

**1. Smaller feature cards on mobile (কেন গ্যালাক্সি নেট?)**
- Change grid from `grid-cols-1` to `grid-cols-2` on mobile
- Reduce card padding from `p-6` to `p-3` on mobile (`p-3 md:p-6`)
- Reduce icon container from `h-12 w-12` to `h-9 w-9` on mobile
- Reduce icon size from `h-6 w-6` to `h-5 w-5` on mobile
- Reduce section padding `py-16` to `py-10` on mobile

**2. Smaller package cards on mobile (জনপ্রিয় প্যাকেজ)**
- Change grid from `grid-cols-1` to `grid-cols-2` on mobile
- Reduce card padding from `p-6` to `p-3` on mobile
- Reduce package name from `text-xl` to `text-base` on mobile
- Reduce speed text from `text-3xl` to `text-xl` on mobile
- Reduce price text from `text-2xl` to `text-lg` on mobile
- Reduce feature list text and spacing
- Reduce section padding

**3. Remove blue gradient from "কাস্টম সমাধান দরকার?" in Services page**

### Changes to `src/pages/Services.tsx`
- Replace `hero-gradient text-primary-foreground` with a simpler style like `bg-secondary/50` with regular text colors, removing the blue gradient CTA section

