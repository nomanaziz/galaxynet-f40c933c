

## Fix: Scroll to Top on Route Change + Scroll-to-Top Button

### Problem
1. When navigating between pages, the scroll position stays where it was instead of resetting to the top.
2. No way to quickly scroll back to the top when far down a page.

### Changes

**New file: `src/components/ScrollToTop.tsx`**
- Uses `useLocation` from react-router-dom to detect route changes
- Calls `window.scrollTo({ top: 0, left: 0 })` on every pathname change
- Renders nothing (returns `null`)

**New file: `src/components/ScrollToTopButton.tsx`**
- Small fixed button in bottom-right corner (above the WhatsApp button)
- Shows only when scrolled down more than 300px
- Uses `ChevronUp` icon from lucide-react
- Smooth scroll to top on click
- Small circular button with brand styling (galaxy-blue background, white icon)
- Fade in/out animation with transition

**File: `src/App.tsx`**
- Add `<ScrollToTop />` right after `<BrowserRouter>`
- Add `<ScrollToTopButton />` alongside `<FloatingWhatsApp />`

### Files to create/modify
- Create `src/components/ScrollToTop.tsx`
- Create `src/components/ScrollToTopButton.tsx`
- Modify `src/App.tsx`

