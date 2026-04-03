

## Add "Memberships & Partners" Section to Home and About Pages

### Overview
Restyle the existing Partners section on the Homepage and add a matching section to the About page, matching the reference design: a "মেম্বারশিপস ও পার্টনারস" badge/label above a row of partner logos on a light beige/cream background.

### Changes

**1. Homepage Partners section (`src/pages/Index.tsx`, lines 333-353)**
- Update the section styling: use a warm cream/beige background (`bg-[#f5f0e8]` or similar)
- Replace the `<h2>` heading with a styled badge/pill label: "মেম্বারশিপস ও পার্টনারস" / "Memberships & Partners"
- Keep the existing DB-driven partner logos logic intact

**2. About page (`src/pages/About.tsx`)**
- Add the same Partners section (fetch from `partners` table) between the Team section and the Footer
- Same cream background, badge label, and logo row layout
- Add Supabase query for partners in the existing `useEffect`

**3. Shared component (optional but cleaner): `src/components/home/PartnersSection.tsx`**
- Extract the partners display into a reusable component used by both pages
- Props: `partners: any[]` array
- Renders the badge label + logo row with cream background

### Technical Notes
- Partners data already exists in the `partners` DB table with admin CRUD
- Homepage already fetches partners — About page needs to add the fetch
- No new dependencies or DB changes needed

