

## Festival Vibe System for Homepage

### Overview
Build a dynamic festival theming system that automatically detects Bangladeshi festivals/events and applies themed visuals, greetings, and decorations to the homepage. Includes admin controls and a special Ramadan mode.

### Database Changes

**New table: `festival_themes`**
- `id` uuid PK
- `name` text (e.g., "Eid ul-Fitr", "Pohela Boishakh")
- `name_bn` text
- `greeting_en` text (e.g., "Eid Mubarak!")
- `greeting_bn` text
- `start_date` date
- `end_date` date
- `hero_image_url` text (optional custom hero image)
- `gradient_from` text (CSS color)
- `gradient_to` text (CSS color)
- `accent_color` text (CSS HSL value to override --accent)
- `decoration_type` text (enum: 'confetti', 'lanterns', 'lights', 'alpana', 'stars', 'none')
- `animation_type` text (enum: 'particles', 'glow', 'snowfall', 'none')
- `is_ramadan` boolean default false
- `sehri_time` text (e.g., "04:15 AM")
- `iftar_time` text (e.g., "06:30 PM")
- `enabled` boolean default true
- `banner_text_en` text
- `banner_text_bn` text
- `created_at` timestamptz default now()

RLS: Public SELECT where `enabled = true`, admin full CRUD.

### New Files

**1. `src/hooks/useFestivalTheme.ts`**
- Fetches active festival from `festival_themes` where `start_date <= today <= end_date AND enabled = true`
- Returns current festival data or null (default theme)
- Calculates Iftar countdown timer if `is_ramadan` is true
- Memoized to avoid re-fetching

**2. `src/components/home/FestivalBanner.tsx`**
- Small banner/badge at top of hero showing festival name + greeting
- Optional countdown to next major event (days/hours/mins)
- Animated entrance with fade-in

**3. `src/components/home/FestivalDecorations.tsx`**
- Renders lightweight CSS/SVG decorations based on `decoration_type`:
  - `lanterns`: Floating lantern SVGs (Eid)
  - `alpana`: Corner alpana patterns (Boishakh)
  - `lights`: Twinkling light dots (Christmas/New Year)
  - `confetti`: CSS confetti animation
  - `stars`: Floating stars (Ramadan)
- Uses CSS animations only (no heavy JS libraries)
- `animation_type` controls background effects (subtle glow, particles via CSS)
- All animations use `will-change` and `transform` for GPU acceleration

**4. `src/components/home/RamadanPanel.tsx`**
- Shows Sehri & Iftar times from DB
- Live Iftar countdown timer (hours:minutes:seconds)
- Styled with dark/spiritual theme (dark card, soft golden glow border)

**5. `src/pages/admin/FestivalManager.tsx`**
- CRUD for festival themes
- Fields: name, dates, greeting, colors, decoration type, hero image upload, Ramadan toggle with sehri/iftar times
- Enable/disable toggle per festival
- Preview of selected decoration type

### Modified Files

**6. `src/pages/Index.tsx`**
- Import and use `useFestivalTheme()` hook
- When a festival is active:
  - Override hero gradient colors with festival's `gradient_from`/`gradient_to`
  - Show `FestivalBanner` component over hero
  - Render `FestivalDecorations` as an overlay layer
  - If Ramadan, show `RamadanPanel` below hero
  - Apply festival hero image if provided
- When no festival: default design (no changes)

**7. `src/index.css`**
- Add CSS keyframes for festival animations:
  - `@keyframes float` (lanterns, stars)
  - `@keyframes twinkle` (lights)
  - `@keyframes confetti-fall`
  - `@keyframes soft-glow` (Ramadan mode)
- Festival decoration utility classes
- Ramadan dark overlay styles

**8. `src/components/admin/AdminSidebar.tsx`**
- Add "Festival Themes" menu item linking to `/admin/festivals`

**9. `src/App.tsx`**
- Add route for `/admin/festivals` → `FestivalManager`

### Auto-Revert System
- The `useFestivalTheme` hook checks `end_date` — once today > end_date, the festival is no longer active and the default design applies automatically
- No manual intervention needed

### Performance Strategy
- All animations are CSS-only (no canvas, no heavy JS particle libraries)
- Decorations use `pointer-events: none` so they don't block interaction
- Limited to 10-15 animated elements max
- `will-change: transform` and `translateZ(0)` for GPU compositing
- Lazy-loaded decoration components (only mounted when festival is active)
- Festival data cached via React Query with 5-minute stale time

### Ramadan Special Mode
- When `is_ramadan = true` on the active festival:
  - Hero section gets a darker, calmer gradient overlay
  - Golden glow accents replace orange
  - Floating star decorations
  - Sehri/Iftar panel visible below hero with live countdown
  - Subtle pulsing glow animation on accent elements

