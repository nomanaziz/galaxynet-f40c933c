

## Make Contact & About Pages Editable from Admin

Currently both pages have hardcoded content. We'll store their editable content in `site_settings` and add admin sections to manage them.

### Approach: Use `site_settings` table (no new tables needed)

Store all Contact and About page content as key-value pairs in the existing `site_settings` table. This keeps things simple and consistent with how hero, topbar, and footer settings already work.

### New Settings Keys

**Contact Page:**
- `contact_phone_1`, `contact_phone_2` — phone numbers
- `contact_email_1`, `contact_email_2` — emails  
- `contact_address_en`, `contact_address_bn` — office address
- `contact_hours_en`, `contact_hours_bn` — business hours
- `contact_friday_hours_en`, `contact_friday_hours_bn` — Friday hours

**About Page:**
- `about_hero_en`, `about_hero_bn` — hero subtitle
- `about_stats` — JSON string of stats array (num, label, label_bn, icon)
- `about_timeline` — JSON string of timeline items (year, title, title_bn, desc, desc_bn)
- `about_team` — JSON string of team members (name, name_bn, role, role_bn)

### Files to Change

| Action | File |
|--------|------|
| Edit | `src/pages/admin/SettingsPage.tsx` — add Contact Page and About Page sections with all new keys |
| Edit | `src/pages/Contact.tsx` — fetch contact details from `site_settings` instead of hardcoded values |
| Edit | `src/pages/About.tsx` — fetch timeline, team, stats from `site_settings` instead of hardcoded values |

### Implementation Details

**SettingsPage** — Add two new card sections:
- "Contact Page" with simple text inputs for phones, emails, address, hours
- "About Page" with JSON textarea editors for stats, timeline, and team arrays (with helper text showing the expected format)

**Contact.tsx** — On mount, fetch all `site_settings` starting with `contact_*`, fall back to current hardcoded values if settings are empty.

**About.tsx** — On mount, fetch `about_*` settings, parse JSON for stats/timeline/team, fall back to hardcoded defaults.

No database migration needed — `site_settings` already supports arbitrary key-value pairs.

