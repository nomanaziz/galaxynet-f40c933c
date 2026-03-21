

## Two Changes: Homepage Services from DB + Footer Credit

### 1. Homepage Services from Database (`src/pages/Index.tsx`)
- Remove hardcoded `servicesPreview` array
- Fetch from `services` table (visible=true, order by sort_order, limit 5)
- Render icon + title only using existing `iconMap` (add missing icons like `Building2`, `Camera`, `Network`)

### 2. Footer Developer Credit (`src/components/Footer.tsx`)
- Add "Developed by: FineHost.net" text in the bottom bar next to the copyright line
- "FineHost.net" links to `https://finehost.net` with `target="_blank"`

