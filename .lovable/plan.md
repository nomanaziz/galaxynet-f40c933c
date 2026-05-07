## Two small fixes

### Cause
- In dark mode I set `--primary-foreground` to a dark color (so orange buttons look right). But the **footer** uses `text-primary-foreground` everywhere, and its background is hard-coded dark via `.footer-galaxy` — so in dark mode the text becomes dark-on-dark and disappears.
- The **Memberships & Partners** section has hard-coded `bg-[#f5f0e8]` and white card backgrounds, so it stays cream/white in dark mode.

### Fix 1 — Footer text always white
The footer's background is permanently dark regardless of theme, so its text should also be permanently light. In `src/components/Footer.tsx`, replace every `text-primary-foreground*` / `bg-primary-foreground/10` / `border-primary-foreground/10` with fixed white equivalents:
- `text-primary-foreground` → `text-white`
- `text-primary-foreground/90` → `text-white/