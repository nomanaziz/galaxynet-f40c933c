

## User Registration + Admin Setup + Cross-Navigation Links

### 1. Create Admin User via Edge Function

Since we can't create auth users from the client side with a pre-set password securely, we'll create a **one-time seed edge function** that:
- Creates the user `galaxynetltd@gmail.com` with password `Galaxy@123` using the service role key
- Assigns `super_admin` role in `user_roles`
- We'll call it once, then it can be removed

Alternatively, simpler approach: **Use Supabase SQL + Auth API**. We'll create the user by calling the edge function once.

### 2. User Registration Page (`/register`)

- New page with email/password signup form using Supabase Auth `signUp()`
- After signup, user gets a default role (no admin access — just registered)
- Clean design matching the site's style
- Redirect to home after successful registration
- Add login/register links in the navbar for non-authenticated users

### 3. Cross-Navigation Links

**Frontend → Admin:**
- Add "Admin Panel" link in the footer (small, subtle)
- Optionally show "Admin" link in navbar for logged-in admin users

**Admin → Frontend:**
- Add "Visit Site" link in the admin sidebar header area, opening `/` in a new tab

### Files to Create/Edit

| Action | File |
|--------|------|
| Create | `supabase/functions/seed-admin/index.ts` — one-time admin creation |
| Create | `src/pages/Register.tsx` — user registration page |
| Create | `src/pages/Login.tsx` — public login page (separate from admin login) |
| Edit | `src/App.tsx` — add `/register` and `/login` routes |
| Edit | `src/components/Navbar.tsx` — add login/register links |
| Edit | `src/components/Footer.tsx` — add "Admin Panel" link |
| Edit | `src/components/admin/AdminSidebar.tsx` — add "Visit Site" link |
| Edit | `src/pages/admin/AdminLayout.tsx` — add "Visit Site" in header |

### Implementation Order

1. Create & deploy seed-admin edge function, call it to create the admin user
2. Create Register and Login pages
3. Add navigation links (frontend ↔ admin)

