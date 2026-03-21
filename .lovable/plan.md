

## Galaxy Net Admin Panel — Implementation Plan (Steps 1–6)

This is a large build. We will implement it in the first batch: database schema, auth, admin layout, dashboard, package CRUD, and coverage area CRUD.

---

### Step 1: Database Schema + RLS

Create a single migration with all tables, the `app_role` enum, the `has_role()` security definer function, and RLS policies.

**Tables:**
- `packages` — id, name, name_bn, speed, price, category (home/corporate), features (jsonb), badges (jsonb), featured, sort_order, visible, created_at
- `coverage_areas` — id, name, name_bn, zone, district, available, created_at
- `connection_orders` — id, name, phone, email, address, area, package_id (FK), preferred_date, notes, status (enum: pending/contacted/completed), assigned_to, created_at
- `pages` — id, slug, title, content, meta_title, meta_description, published, created_at
- `notices` — id, title, title_bn, category (enum: maintenance/offer/alert), content, published, created_at
- `site_settings` — id, key (unique), value, created_at
- `payment_methods` — id, name, account_number, logo_url, instructions, sort_order, visible, created_at
- `user_roles` — id, user_id (FK auth.users, unique), role (enum: super_admin/admin/staff)

**Security:**
- `app_role` enum: super_admin, admin, staff
- `has_role(uuid, app_role)` — security definer function
- Public SELECT on: packages, coverage_areas, pages, notices, site_settings, payment_methods (where visible/published)
- Public INSERT on: connection_orders (for visitors submitting orders — no auth required)
- Admin INSERT/UPDATE/DELETE on all tables via `has_role()`
- user_roles: SELECT/INSERT/UPDATE/DELETE only for super_admin

**Seed data:** Insert existing hardcoded packages and coverage areas into the new tables so the site works immediately.

---

### Step 2: Admin Authentication

- Create `/admin/login` page with email/password Supabase Auth login
- Create `useAdminAuth` hook that checks `user_roles` table for the logged-in user
- Redirect non-admin users away from `/admin/*` routes

---

### Step 3: Admin Layout

- Create `AdminLayout.tsx` with shadcn/ui Sidebar (collapsible)
- Sidebar sections: Dashboard, Packages, Coverage, Orders, Pages, Notices, Settings, Users
- Role-based visibility (Users + Settings only for super_admin)
- `SidebarTrigger` always visible in header
- Nested routes via React Router `<Outlet />`

---

### Step 4: Dashboard

- Stats cards: Total Orders, Active Packages, Coverage Areas, Pending Orders (fetched from Supabase with `.select('*', { count: 'exact', head: true })`)
- Recent orders table (last 10)
- Simple bar chart with Recharts for orders by status

---

### Step 5: Package Management

- Data table listing all packages with columns: Name, Speed, Price, Category, Featured, Visible, Actions
- Add/Edit dialog with form (react-hook-form + shadcn/ui)
- Delete with AlertDialog confirmation
- Inline toggle for visible/featured via Switch

---

### Step 6: Coverage Area Management

- Data table: Area Name (EN/BN), Zone, District, Available
- Add/Edit/Delete dialogs
- Toggle available/unavailable inline

---

### File Structure

```text
src/
├── pages/admin/
│   ├── AdminLogin.tsx
│   ├── AdminLayout.tsx
│   ├── Dashboard.tsx
│   ├── PackageManager.tsx
│   ├── CoverageManager.tsx
│   ├── OrderManager.tsx        (placeholder)
│   ├── PageManager.tsx         (placeholder)
│   ├── NoticeManager.tsx       (placeholder)
│   ├── SettingsPage.tsx        (placeholder)
│   └── UserManager.tsx         (placeholder)
├── components/admin/
│   ├── AdminSidebar.tsx
│   └── StatsCard.tsx
├── hooks/
│   └── useAdminAuth.ts
└── App.tsx                     (add /admin/* routes)
```

### Routing Changes (App.tsx)

Add protected admin routes:
- `/admin/login` — AdminLogin
- `/admin` — AdminLayout wrapper with nested routes:
  - index → Dashboard
  - `packages` → PackageManager
  - `coverage` → CoverageManager
  - `orders` → OrderManager (placeholder)
  - `pages` → PageManager (placeholder)
  - `notices` → NoticeManager (placeholder)
  - `settings` → SettingsPage (placeholder)
  - `users` → UserManager (placeholder)

---

### Migration SQL Summary

One migration creates: 2 enums, 8 tables, 1 security definer function, ~20 RLS policies, and seed data for packages + coverage areas.

### Important Notes

- connection_orders allows anonymous INSERT (no auth needed — visitors submit orders)
- site_settings and payment_methods have public read for visible items
- After implementation, you will need to create an admin user via Supabase Auth dashboard and assign them a role in `user_roles`

