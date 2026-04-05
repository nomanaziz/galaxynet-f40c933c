

## Show Team Members Grouped by Department

### Problem
Currently the About page shows all team members in a flat grid without any department grouping. The user wants members organized by department, displayed in department sort order.

### Changes

**File: `src/pages/About.tsx`**

1. Update the `TeamMember` interface to include `department_id`
2. Fetch departments separately: `supabase.from("departments").select("*").eq("visible", true).order("sort_order")`
3. Replace the flat team grid with a department-grouped layout:
   - Loop through departments (sorted by `sort_order`)
   - For each department, show a department name heading (EN/BN)
   - Below each heading, show a grid of members belonging to that department
   - Members without a department go into an "Other" section at the end
4. Keep the existing card design for each member

**Resulting layout:**
```text
Our Team / আমাদের দল

── Management / ম্যানেজমেন্ট ──
[Member] [Member] [Member] [Member]

── Technical / টেকনিক্যাল ──
[Member] [Member] [Member]

── Support / সাপোর্ট ──
[Member] [Member]
```

### No database changes needed
The `employees` table already has `department_id` and the `departments` table has `sort_order`. The query already joins `departments(name, name_bn)`.

