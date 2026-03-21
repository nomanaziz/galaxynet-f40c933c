

## Galaxy Net Admin Panel — Implementation Plan

### Current State
The website is fully static — all data (packages, coverage areas, orders) is hardcoded in React components. An admin panel requires a **database backend** to store and manage content dynamically.

### Prerequisites
- **Supabase** connection is required for: authentication (admin login), database (packages, areas, orders, pages, settings), and storage (media/images)
- All visitor-facing pages will be refactored to fetch data from Supabase instead of hardcoded arrays

---

### Phase 1: Database Foundation

**Tables to create:**
- `packages` — name, speed, price, category (home/corporate), features (jsonb), badges (jsonb), featured, sort_order, visible
- `coverage_areas` — name, name_bn, zone, district, available (boolean)
- `connection_orders` — name, phone, email, address, area, package_id, preferred_date, notes, status (pending/contacted/completed), assigned_to, created_at
- `pages` — slug, title, content (rich text), meta_title, meta_description, published
- `notices` — title, category (maintenance/offer/alert), content, published, created_at
- `site_settings` — key/value store for website name, logo URL, phone, email, address, social links, maintenance mode
- `payment_methods` — name, account_number, logo_url, instructions, sort_order, visible
- `contact_info` — phone, email, address, map_embed, social_links (jsonb)
- `user_roles` — user_id, role (super_admin/admin/staff) — separate table per security requirements
- `menu_items` — label, url, parent_id, sort_order, visible

**RLS policies:** Admin-only write access via `has_role()` security definer function. Public read for packages, areas, pages, notices, settings.

---

### Phase 2: Admin Authentication & Layout

- Admin login page at `/admin/login` with Supabase Auth (email/password)
- Protected `/admin/*` routes checking user role
- Sidebar layout using **shadcn/ui Sidebar** component with sections: Dashboard, Packages, Coverage, Orders, Pages, Notices, Settings, Media
- Role-based menu visibility (super_admin sees User Management + Settings)

---

### Phase 3: Admin Modules (shadcn/ui throughout)

**3.1 Dashboard** (`/admin`)
- Stats cards: Total Orders, Active Packages, Coverage Areas, Pending Orders
- Recent orders table (last 10)
- Charts using Recharts (daily orders, package popularity)

**3.2 Package Management** (`/admin/packages`)
- Data table with columns: Name, Speed, Price, Category, Featured, Visible, Actions
- Add/Edit dialog with form fields matching the `packages` table
- Delete with confirmation dialog
- Toggle visibility and featured status inline

**3.3 Coverage Area Management** (`/admin/coverage`)
- Data table: Area Name, Zone, District, Available status
- Add/Edit/Delete areas
- Bulk toggle available/unavailable

**3.4 Connection Orders** (`/admin/orders`)
- Full data table with filters (status, date range)
- Status dropdown to update: Pending → Contacted → Completed
- Click-to-call and WhatsApp links
- CSV export button

**3.5 CMS Pages** (`/admin/pages`)
- List of pages with edit/delete
- Rich text editor (using a simple textarea/markdown initially, upgradeable)
- SEO fields: meta title, description

**3.6 Notices** (`/admin/notices`)
- CRUD for maintenance alerts, offers, fiber cut notices
- Category badge, publish/draft toggle

**3.7 Site Settings** (`/admin/settings`)
- Website name, logo URL, contact info
- Payment methods management
- Social links
- Maintenance mode toggle

**3.8 User Management** (`/admin/users`) — Super Admin only
- View admins/staff
- Invite new admin (Supabase auth invite)
- Role assignment

---

### Phase 4: Refactor Visitor Pages

Update all public pages to fetch from Supabase instead of hardcoded data:
- `Index.tsx` — fetch packages, settings, testimonials
- `Packages.tsx` — fetch from `packages` table with filters
- `Coverage.tsx` — fetch from `coverage_areas` table
- `Order.tsx` — submit to `connection_orders` table, fetch packages for dropdown
- `Notices.tsx` — fetch from `notices` table
- `Contact.tsx` — fetch contact info from `site_settings`

---

### File Structure

```text
src/
├── pages/
│   └── admin/
│       ├── AdminLogin.tsx
│       ├── AdminLayout.tsx      (sidebar + outlet)
│       ├── Dashboard.tsx
│       ├── PackageManager.tsx
│       ├── CoverageManager.tsx
│       ├── OrderManager.tsx
│       ├── PageManager.tsx
│       ├── NoticeManager.tsx
│       ├── SettingsPage.tsx
│       └── UserManager.tsx
├── components/
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── StatsCard.tsx
│       └── DataTable.tsx
└── hooks/
    └── useAdminAuth.ts
```

---

### Implementation Order

1. Connect Supabase + create all database tables + RLS
2. Admin auth + login page + protected routes
3. Admin sidebar layout
4. Dashboard with stats
5. Package CRUD
6. Coverage area CRUD
7. Orders management
8. CMS pages + Notices
9. Settings + Payment methods
10. Refactor visitor pages to use live data
11. User management (super admin)

This is a large build. I recommend implementing it in batches — starting with **Steps 1–6** (database + auth + core CRUD modules), then **Steps 7–11** in a follow-up.

