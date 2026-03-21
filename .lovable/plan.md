

## Multi-Part Update: Dynamic Menu, Editable Footer, Nav Improvements

### 1. Navbar — Fetch Menu from DB + Add Missing Items

**Current problem:** Navbar has hardcoded `navLinks` array. Menu items exist in `menu_items` table but aren't used by the Navbar.

**Fix:** Rewrite `Navbar.tsx` to fetch from `menu_items` table (visible=true, ordered by sort_order). This makes the admin Menu Manager the single source of truth.

**New menu items to seed** (via insert tool):
- "Pay Bill" → `/payment` (sort_order 7)
- "Offers" → `/offers` (sort_order 8)

### 2. Navbar — User Icon with Dropdown (Login/Signup/Admin)

Replace separate Login + Sign Up buttons with a single **User icon button** that opens a dropdown:
- **Not logged in:** Shows "Login" and "Sign Up" links
- **Logged in (regular user):** Shows "My Account" and "Logout"
- **Logged in (admin):** Shows "Admin Panel" link + "Logout"

Check admin role using the existing `user_roles` table query.

### 3. Navbar — Selfcare Button

Add a prominent "Selfcare" button on the navbar (next to language switcher) that links to `https://portal.galaxynetbd.com/ClientRegistration/SignUp` (fetched from `site_settings.selfcare_url`).

### 4. Footer — Fetch Contact Info from `site_settings`

**Current problem:** Footer has hardcoded phone, email, address.

**Fix:** Fetch `phone`, `email`, `address`, `facebook` from `site_settings` table and render dynamically.

### 5. Admin Settings — Ensure All Keys Editable

Add missing settings keys to `SettingsPage.tsx`:
- `address_bn` (Bangla address)

The existing settings page already has phone, email, address, hotline, facebook. Just need to ensure footer reads from these.

### Files to Change

| Action | File |
|--------|------|
| Data | Insert "Pay Bill" and "Offers" menu items |
| Rewrite | `src/components/Navbar.tsx` — fetch menu from DB, user icon dropdown, selfcare button |
| Rewrite | `src/components/Footer.tsx` — fetch contact info from site_settings |
| Edit | `src/pages/admin/SettingsPage.tsx` — add `address_bn` key |

### Implementation Details

**Navbar data fetching:**
- Query `menu_items` where `visible=true` ordered by `sort_order`
- Query `site_settings` for `selfcare_url`
- Query `user_roles` for current user to check admin status

**User icon dropdown** (using shadcn DropdownMenu):
- Trigger: `<User>` icon button
- Items change based on auth state + role

**Footer:** Single `useEffect` to fetch all site_settings, then render phone/email/address/social links from that data.

