## Problem

In `src/components/home/CacheMarquee.tsx`, each logo card has a white background (`bg-white dark:bg-white/95`). When a logo image fails to load, the fallback brand-name text (`<span>`) is shown with `text-foreground`. In dark mode, `--foreground` is light, so the text becomes white-on-white and is unreadable (visible in the screenshot: TikTok, Apple, Cloudflare, Akamai, Microsoft, Amazon, Facebook).

## Fix

Since the card background is white in both light and dark modes, the fallback text must always be dark — independent of the theme.

Change in `src/components/home/CacheMarquee.tsx` (the fallback `<span>`):

- Replace `text-foreground` with a fixed dark token like `text-slate-900` (or `text-galaxy-blue-dark`) so it stays readable on the white card in dark mode.

No other files need changes.