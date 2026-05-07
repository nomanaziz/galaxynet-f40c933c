## Cache Marquee section dark mode

In `src/components/home/CacheMarquee.tsx`:
- Section background: `bg-[hsl(40,40%,96%)]` → add `dark:bg-background` so the cream backdrop becomes the dark theme background.
- Logo card chips: `bg-white` → add `dark:bg-card` so each chip uses the dark card surface (logos remain visible against it).

No text/label changes needed — the purple badge and muted heading already read fine on the dark background.
