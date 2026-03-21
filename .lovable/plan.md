

## Employee & Department Management + About Page Admin

### Problem
The About page team section is managed via JSON strings in `site_settings` — hard to use. The user wants proper tables for departments, designations, and employees, plus an admin page to manage them. The About page team section should pull from these tables.

### Database Changes (Migration)

**New tables:**

1. **`departments`** — id, name, name_bn, sort_order, visible, created_at
   - Seed: NOC, CRM, Transmission, Accounts, Sales & Marketing, Management

2. **`designations`** — id, name, name_bn, sort_order, created_at
   - Seed: CEO, Manager, Engineer, Executive, Officer, etc.

3. **`employees`** — id, name, name_bn, department_id (FK → departments), designation_id (FK → designations), phone, email, photo_url, sort_order, visible, show_on_about (boolean — controls About page team section), created_at

**RLS:** Public SELECT (visible=true), admin CRUD — same pattern as other tables.

### New Admin Pages

1. **`src/pages/admin/DepartmentManager.tsx`** — CRUD for departments
2. **`src/pages/admin/DesignationManager.tsx`** — CRUD for designations  
3. **`src/pages/admin/EmployeeManager.tsx`** — CRUD for employees with department/designation dropdowns, photo upload to `media` bucket, `show_on_about` toggle

### Update Existing Files

| Action | File |
|--------|------|
| Edit | `src/components/admin/AdminSidebar.tsx` — add "About Us" group with Departments, Designations, Employees links |
| Edit | `src/App.tsx` — add routes for `/admin/departments`, `/admin/designations`, `/admin/employees` |
| Edit | `src/pages/About.tsx` — replace JSON-based team section with query from `employees` where `show_on_about=true`, join department + designation |
| Edit | `src/pages/admin/SettingsPage.tsx` — remove `about_team` JSON field (replaced by employees table) |

### About Page Team Section
- Fetch employees where `show_on_about=true` and `visible=true`, joined with department and designation
- Show employee photo (or icon fallback), name, designation, department as badge

