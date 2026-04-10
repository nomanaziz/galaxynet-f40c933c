

## Staff/Supervisor Management System with Permissions

### Problem
Current User Manager requires pasting raw UUIDs from Supabase dashboard -- not practical. Admin needs to create staff accounts directly and assign granular permissions.

### Solution

#### 1. New Database Table: `staff_permissions`
Stores which admin sections each staff user can access.

```text
staff_permissions
├── id (uuid, PK)
├── user_id (uuid, references auth.users)
├── permission (text) -- e.g. 'packages', 'orders', 'coverage', etc.
└── created_at (timestamptz)
```

RLS: Only super_admin/admin can manage permissions. Users can read their own.

#### 2. New Edge Function: `create-staff-user`
Since client-side Supabase SDK cannot create users on behalf of others, an edge function using the **service role key** will:
- Accept `{ email, password, name, role }` from admin
- Call `supabase.auth.admin.createUser()` to create the account
- Insert a row into `user_roles` with the chosen role
- Return the new user's ID

Protected by checking the calling user is an admin.

#### 3. Rebuilt `UserManager.tsx` Page
Replace the current raw-UUID interface with a proper management UI:

- **User list** showing: Name/Email, Role badge, Permission count, Actions
- **"Add Staff" dialog** with fields: Name, Email, Password, Role (admin/staff/supervisor)
- **"Manage Permissions" dialog** with checkboxes for each admin section:
  - Packages, Coverage, Orders, Pages, Notices, Offers, Testimonials, Partners, Features, Menu, Payments, Homepage, Media, Services, Festivals, About, Departments, Designations, Employees
- **Delete** button to remove a staff member's access

#### 4. Permission-based Sidebar Filtering
Update `AdminSidebar.tsx` to:
- Fetch the current user's permissions from `staff_permissions`
- **super_admin/admin**: sees everything (full access)
- **staff/supervisor**: only sees sidebar items they have permission for

#### 5. Permission-based Route Protection
Update `AdminLayout.tsx` to check permissions on each route. If a staff user navigates to a section they don't have permission for, redirect to dashboard with a toast message.

### Files to Create
- `supabase/functions/create-staff-user/index.ts` -- edge function
- Migration for `staff_permissions` table + new `supervisor` role enum value

### Files to Modify
- `src/pages/admin/UserManager.tsx` -- complete rewrite with proper UI
- `src/components/admin/AdminSidebar.tsx` -- permission-based menu filtering
- `src/pages/admin/AdminLayout.tsx` -- route-level permission check
- `src/hooks/useAdminAuth.ts` -- add permissions array to the return value

### Visual Layout

```text
┌─────────────────────────────────────────────┐
│  Staff Management                  [+ Add]  │
├──────────┬──────────┬────────────┬──────────┤
│ Email    │ Role     │ Permissions│ Actions  │
├──────────┼──────────┼────────────┼──────────┤
│ staff@.. │ Staff    │ 5 sections │ ✏️ 🗑️    │
│ super@.. │ Admin    │ Full Access│ 🗑️       │
└──────────┴──────────┴────────────┴──────────┘

Add Staff Dialog:
┌────────────────────────────┐
│ Name:     [____________]   │
│ Email:    [____________]   │
│ Password: [____________]   │
│ Role:     [Staff     ▼]   │
│                            │
│ Permissions:               │
│ ☑ Packages  ☑ Orders      │
│ ☑ Coverage  ☐ Pages       │
│ ☐ Notices   ☐ Settings    │
│ ...                        │
│        [Cancel] [Create]   │
└────────────────────────────┘
```

