

## Galaxy-Themed Footer Background

### What Changes
Add a deep space / galaxy-inspired background to the footer using CSS-only techniques — stars (tiny radial gradients), nebula glows, and subtle animated twinkling dots. No images needed.

### Changes

**File: `src/components/Footer.tsx`**
1. Replace the plain `bg-primary` footer wrapper with a `relative overflow-hidden` container that uses a dark navy gradient background (`gradient-navy-dark`)
2. Add an absolutely positioned decorative layer inside the footer with:
   - Scattered "star" dots using small `<span>` elements with `animate-twinkle` (already defined in CSS)
   - Two radial gradient nebula glows (blue and orange, matching brand colors) as pseudo-elements via a dedicated wrapper div

**File: `src/index.css`**
1. Add a new `.footer-galaxy` utility class with:
   - Deep navy-to-dark-blue gradient background
   - CSS `::before` pseudo-element with radial gradient nebula spots (subtle blue and orange glows)
   - CSS `::after` pseudo-element with a repeating radial-gradient pattern for tiny star dots
2. Add a `@keyframes star-flicker` animation for subtle star brightness variation

### Visual Result
- Dark navy/space background with subtle blue and orange nebula glows
- Tiny scattered star-like dots with gentle twinkling
- Content remains fully readable with existing white text
- Matches "Galaxy Net" brand identity perfectly

### Files to modify
- `src/components/Footer.tsx`
- `src/index.css`

