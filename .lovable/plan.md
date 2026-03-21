

## 3 Changes: Logo Replacement, Brand Blue Color, Page Hero Backgrounds

### 1. Replace Logo Everywhere

Copy `user-uploads://logo.png` to `src/assets/logo.png`. Replace the current Wifi icon + "Galaxy Net" text with the logo image in:

| File | Current | New |
|------|---------|-----|
| `src/components/Navbar.tsx` | Blue rounded square with Wifi icon + text | `<img>` of logo (~160px wide) |
| `src/components/Navbar.tsx` (mobile sheet) | Same Wifi icon + text | `<img>` of logo |
| `src/pages/Login.tsx` | Wifi icon in card header | Logo image |
| `src/pages/Register.tsx` | Wifi icon in card header | Logo image |
| `src/pages/admin/AdminLogin.tsx` | Wifi icon + "Galaxy Net Admin" | Logo image + "Admin" text |
| `src/components/admin/AdminSidebar.tsx` | Likely has Wifi icon | Logo image |
| `src/components/Footer.tsx` | Wifi icon + text | Logo image |

### 2. Update Brand Blue to Match Logo

The logo uses a teal-blue color approximately `hsl(195, 75%, 38%)` (hex ~#1A7FA0). Update CSS variables in `src/index.css`:

- `--primary`: change from `215 61% 27%` to ~`195 75% 38%`
- `--galaxy-blue` variants: update to match
- `--sidebar-background`, `--sidebar-accent`, `--sidebar-border`: update accordingly
- `--secondary-foreground`: update to match new primary

This will cascade to all titles, buttons, borders, sidebar, and admin panel automatically since they use these CSS variables.

### 3. Add Decorative Background to Page Hero Sections

Enhance the `.page-hero` class in `src/index.css` with a subtle decorative pattern or gradient overlay to make page headers more visually appealing. Options:
- Add a subtle SVG wave/dot pattern as background
- Add a soft gradient with the brand blue tint
- Add a subtle geometric pattern using CSS

Each page already uses `page-hero` class, so a single CSS change will apply everywhere. The reference image shows a clean light gradient with subtle depth — enhance the existing gradient to include a hint of the brand blue.

### Files to Change

| File | Change |
|------|--------|
| `src/assets/logo.png` | New file (copied from upload) |
| `src/index.css` | Update primary/blue CSS vars + enhance `.page-hero` background |
| `src/components/Navbar.tsx` | Replace Wifi icon with logo image (desktop + mobile) |
| `src/components/Footer.tsx` | Replace Wifi icon with logo image |
| `src/pages/Login.tsx` | Replace Wifi icon with logo image |
| `src/pages/Register.tsx` | Replace Wifi icon with logo image |
| `src/pages/admin/AdminLogin.tsx` | Replace Wifi icon with logo image |
| `src/components/admin/AdminSidebar.tsx` | Replace Wifi icon with logo image |

