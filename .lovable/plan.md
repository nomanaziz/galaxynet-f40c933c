

## Floating Buttons Rearrangement + Rocket Scroll-to-Top + Close Option

### Changes Summary

1. **FloatingCTA → Move to LEFT side** (currently right, move to left — same level as WhatsApp but stacked above it)
2. **ScrollToTopButton → Add rocket SVG** (copy uploaded `top.svg` to `public/images/rocket.svg`, use as image instead of ChevronUp icon)
3. **Align left/right floating buttons symmetrically** — WhatsApp on bottom-left, Get Connection above it on left; ScrollToTop on bottom-right
4. **Add close/dismiss button on mobile** for both WhatsApp and FloatingCTA — small X button that hides them for the session (using useState)

### Layout (Mobile)

```text
                              ┌──────────┐
                              │ 🚀 Top   │  ← right side
                              └──────────┘
┌──────────┐ ✕
│ CTA      │                  
└──────────┘
┌──────────┐ ✕
│ WhatsApp │
└──────────┘
╔══════════════════════════════╗
║  Home  Svc  About  Pkg  Call║  ← Bottom Nav
╚══════════════════════════════╝
```

### Files

| File | Action |
|---|---|
| `public/images/rocket.svg` | Copy uploaded `top.svg` here |
| `src/components/ScrollToTopButton.tsx` | Replace ChevronUp with rocket SVG image |
| `src/components/FloatingCTA.tsx` | Move to left side (`left-4`), add mobile close button with session state |
| `src/components/FloatingWhatsApp.tsx` | Add mobile close button with session state, adjust position (bottom-28 on mobile to stack below CTA) |
| `src/components/Layout.tsx` | Add `FloatingWhatsApp` and `ScrollToTopButton` imports if not already present |

### Technical Details

- **Close buttons**: Small absolute-positioned X icon (top-right of each floating button), only visible on mobile (`md:hidden`). Uses `useState` — dismissed for the current page session, reappears on page reload.
- **Rocket image**: `<img src="/images/rocket.svg" className="h-7 w-7" />` replacing `<ChevronUp />`
- **Position alignment**: WhatsApp at `bottom-20 left-4`, CTA at `bottom-36 left-4` on mobile; both at same horizontal position on desktop (`left-6`)
- **ScrollToTop**: Stays on right side at `bottom-20 right-4` on mobile, `bottom-8 right-6` on desktop

