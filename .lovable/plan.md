

## Move Cache Marquee Section Higher

Currently the page order is:
1. Hero → 2. Ramadan → 3. Trust Stats → 4. Fiber Banner → 5. Why Choose Us → 6. Services → 7. Gaming Banner → **8. Cache Marquee** → 9. Packages → ...

**Change**: Move `<CacheMarquee />` from position 8 to right after the **Trust Stats** section (position 4), so users see the cache server logos early.

New order: Hero → Ramadan → Trust Stats → **Cache Marquee** → Fiber Banner → Why Choose Us → Services → Gaming Banner → Packages → ...

### File to Modify
- `src/pages/Index.tsx` — move the `<CacheMarquee />` line from after Gaming Banner (line 230) to after Trust Stats (after line 143)

