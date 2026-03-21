

## Insert New Packages + Add Dedicated Category

### 1. Database Migration
Add `dedicated` value to `package_category` enum:
```sql
ALTER TYPE package_category ADD VALUE 'dedicated';
```

### 2. Data Operations (via insert tool)
- Delete all existing 7 packages
- Insert 10 Home packages (Starter+ through Titan+)
- Insert 5 Corporate packages (Startup+ through Premium+)
- Insert 1 Dedicated package with price 0 and a "Call for Price" indicator

### 3. Update `Packages.tsx`
- Add a third tab: "Dedicated" (ডেডিকেটেড)
- For dedicated packages, show "Call for Price" instead of a price number
- Keep existing card layout and speed filter

### Files
| Action | File |
|--------|------|
| Migration | Add `dedicated` to `package_category` enum |
| Data | Delete old packages, insert 16 new ones |
| Edit | `src/pages/Packages.tsx` — add Dedicated tab, handle "Call for Price" |
| Edit | `src/pages/admin/PackageManager.tsx` — add `dedicated` to category dropdown |

