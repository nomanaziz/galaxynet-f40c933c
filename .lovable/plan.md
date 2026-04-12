

## FTP/OTT/Live TV Server Links Page (Smart TV Compatible)

### Overview
Create a standalone `/ftp` page that displays categorized server links (FTP/OTT/Movie Servers, Live TV Servers) with admin-managed content. The page will be **outside the main Layout** (no navbar, footer, floating buttons) and use **minimal inline CSS with no JavaScript** for Smart TV browser compatibility.

### Database

**New table: `ftp_servers`**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Server name (e.g., "NaturalBD") |
| category | text | "ftp" / "ott" / "livetv" |
| logo_url | text | URL to logo image |
| link | text | Server URL |
| sort_order | int | Display order |
| visible | boolean | Show/hide toggle |
| created_at | timestamp | Auto |

**New table: `ftp_page_settings`**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| notice_text | text | Top notice banner text |
| helpline | text | Bottom helpline number |

### Frontend Page: `src/pages/FtpServers.tsx`

- Renders a **standalone page** (not wrapped in Layout)
- Fetches data from Supabase, then renders pure HTML structure with **inline styles only**
- No Tailwind classes, no JS interactivity on the rendered content
- Categories displayed as sections with icon grid cards
- Notice banner at top, helpline at bottom
- Responsive grid using CSS Grid (no flexbox hacks)
- Design matches the reference image: light background, rounded cards, category headers with icons

### Route
- Add `/ftp` route **outside** the `<Route element={<Layout />}>` wrapper in App.tsx (same level as admin routes)

### Admin Page: `src/pages/admin/FtpServerManager.tsx`

- CRUD for ftp_servers (add/edit/delete servers with name, category, logo URL, link, sort order)
- Edit notice text and helpline number
- Logo upload via URL input
- Add to admin sidebar and routes

### Files to Create
- `src/pages/FtpServers.tsx` — standalone public page
- `src/pages/admin/FtpServerManager.tsx` — admin manager

### Files to Modify
- `src/App.tsx` — add `/ftp` route outside Layout
- `src/components/admin/AdminSidebar.tsx` — add FTP manager link
- Migration — create `ftp_servers` and `ftp_page_settings` tables with RLS

### Smart TV Compatibility Strategy
- Page uses React only for data fetching, then renders with **inline CSS styles** (no external stylesheets dependency)
- No JavaScript-dependent interactions (no hover effects via JS, no animations)
- Simple CSS Grid layout, large touch-friendly cards
- All images via `<img>` tags with alt text fallbacks

