

## Add Services CRUD to Admin Panel

### Problem
The Services page has 5 hardcoded services. The user wants to manage them from the admin panel.

### Database Migration

Create a `services` table:
- `id` uuid PK default gen_random_uuid()
- `title` text NOT NULL
- `title_bn` text
- `description` text
- `description_bn` text
- `icon_name` text NOT NULL default 'wifi' (lucide icon name)
- `badge` text (e.g. "Most Popular")
- `badge_bn` text
- `link` text default '/contact'
- `features` jsonb default '[]' (array of {en, bn} objects)
- `visible` boolean default true
- `sort_order` integer default 0
- `created_at` timestamptz default now()

RLS: public SELECT (visible=true), admin CRUD — same pattern as other tables.

Seed with the 5 existing services so nothing changes visually.

### New File: `src/pages/admin/ServicesManager.tsx`
CRUD page following the same pattern as FeaturesManager/OffersManager:
- Table listing services with icon, title, badge, visibility toggle
- Dialog form for add/edit with: title (en/bn), description (en/bn), icon_name dropdown, badge (en/bn), link, features JSON, visible toggle, sort_order

### Updated Files

| File | Change |
|------|--------|
| `src/App.tsx` | Add route `/admin/services` → ServicesManager |
| `src/components/admin/AdminSidebar.tsx` | Add "Services" item to main nav group |
| `src/pages/Services.tsx` | Fetch from `services` table instead of hardcoded array, map `icon_name` string to lucide icon component |

### Icon Mapping
Create a simple map of icon_name strings to lucide components (Wifi, Building2, Server, Camera, Network, etc.) for rendering on the public Services page.

