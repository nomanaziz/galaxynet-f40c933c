

## Employee Ordering — Move Up/Down Buttons per Department

### Problem
Employees have a `sort_order` field but the admin has no easy way to reorder them. The About page shows members grouped by department, so ordering should be within each department.

### Changes

**File: `src/pages/admin/EmployeeManager.tsx`**

1. **Group the table by department**: Instead of a flat table, show employees grouped under department headings (similar to About page layout). Ungrouped employees go under "No Department".

2. **Add Move Up / Move Down buttons** to each row:
   - `ArrowUp` and `ArrowDown` icon buttons in the Actions column
   - On click, swap `sort_order` with the adjacent employee in the same department group
   - Disable Up on the first item, Down on the last item within each group
   - Persist both swapped `sort_order` values to Supabase immediately

3. **Add a "Sort Order" column** to the table to show current order visually.

4. **Sort items by department then sort_order** when displaying:
   - Group `items` by `department_id`
   - Within each group, sort by `sort_order` ascending

5. **Add `handleMoveUp` / `handleMoveDown` functions**:
   ```
   - Get filtered list of employees in same department
   - Find current index
   - Swap sort_order with previous/next item
   - Update both rows in Supabase
   - Refetch
   ```

### No database changes needed
The `sort_order` column already exists on the `employees` table.

### Files to modify
- `src/pages/admin/EmployeeManager.tsx` — Add up/down reorder buttons grouped by department

