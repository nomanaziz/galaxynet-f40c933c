

## Fix: Admin Panel Direct Access (Skip Login if Already Authenticated)

Two issues:

1. **Navbar links to `/admin/login`** instead of `/admin`** — when the user is already logged in as admin, clicking "Admin Panel" should go directly to `/admin` (the dashboard), not the login page.

2. **AdminLogin doesn't auto-redirect** — if an already-authenticated admin visits `/admin/login`, they see the login form again instead of being redirected to `/admin`.

### Changes

**`src/components/Navbar.tsx`** (2 places)
- Line 158: Change `navigate("/admin/login")` → `navigate("/admin")`
- Line 241: Change `to="/admin/login"` → `to="/admin"`

**`src/pages/admin/AdminLogin.tsx`**
- Add `useAdminAuth()` hook at the top
- Add `useEffect` that redirects to `/admin` if user is already authenticated with an admin role
- Show a loading spinner while checking auth state

This way:
- Already logged-in admins go straight to the dashboard
- Non-authenticated users see the login form as before
- Single click from navbar → admin panel

