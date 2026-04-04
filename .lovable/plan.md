
## Main fix
`Coverage Areas` tab-কে `Location Hierarchy`-র সাথে সরাসরি bind করতে হবে, যাতে parent division/district/thana disable হলে child areas admin panel এবং public coverage—দুই জায়গাতেই automatic inherit করে hidden/disabled হয়।

## আমি যা দেখেছি
- DB-তে `coverage_areas.location_id` already আছে, এবং **622/622 area linked**।
- সব linked area এখন `thana`-র সাথে attached।
- Public `Coverage.tsx` already ancestor-chain দেখে hidden logic apply করছে।
- কিন্তু admin `CoverageManager`-এর `AreasTab` এখনো `coverage_areas` flat ভাবে load করে, তাই hierarchy off করলেও **সব 622 area** দেখায়।
- অর্থাৎ সমস্যা linkage-এ না; সমস্যা হলো **admin list এবং effective status calculation**-এ।

## Implementation plan

### 1) Shared hierarchy logic এক জায়গায় আনা
একটা shared helper বানানো হবে যেখানে থাকবে:
- `locationMap`
- ancestor disabled check
- descendant lookup
- effective area visibility/status calculation

এটা admin আর public—দুই জায়গায় reuse হবে, যাতে একই rule everywhere কাজ করে।

### 2) Admin CoverageManager data flow refactor
`CoverageManager` parent component-এ `areas`, `locations`, `refreshData()` lift করা হবে।
- `LocationsTab` location toggle করলে
- `AreasTab` একই fresh data থেকে instant updated state পাবে

এতে hierarchy change আর area list mismatch থাকবে না।

### 3) Areas tab-কে hierarchy-based করা
বর্তমান flat 622-row table-এর বদলে list hierarchy follow করবে:
- Division filter
- District filter
- Thana filter
- Zone filter

Default behavior:
- শুধু **effective-enabled** areas দেখাবে
- optional admin toggle থাকবে: `Show hierarchy-hidden areas`

তখন 7 district/division off থাকলে 622 না দেখিয়ে only active branch-এর area দেখাবে।

### 4) Automatic inherited disable system
প্রতি area row-র জন্য effective state calculate হবে:
- `manual state` = `coverage_areas.available`
- `hierarchy state` = linked location + parent chain enabled কিনা

যদি parent district/division off হয়:
- area row `Hidden by hierarchy` badge পাবে
- area switch/edit action disabled বা read-only হবে
- normal list থেকে hide হবে
- bulk available/unavailable action-এও include হবে না

Parent আবার on করলে area automatic ফিরে আসবে, এবং আগের manual `available` state preserve থাকবে।

### 5) Admin UX clearer করা
Areas tab-এ দেখানো হবে:
- total linked areas
- visible by hierarchy
- hidden by hierarchy

প্রতি row-তে breadcrumb/reason দেখানো হবে, যেমন:
`Dhaka > Manikganj > Singair`
এবং badge:
`Hidden by District` / `Hidden by Division`

### 6) Create/Edit area guard
নতুন area add/edit করার সময়:
- disabled branch-এর নিচে area assign করা যাবে না
- dropdown-এ only effective-enabled locations দেখানো হবে
- existing area disabled branch-এর নিচে থাকলে warning দেখানো হবে

## Files
- `src/pages/admin/CoverageManager.tsx`
- `src/pages/Coverage.tsx`
- `src/lib/coverageHierarchy.ts` (new shared helper)

## Technical note
এই fix-এর জন্য নতুন migration দরকার নেই, কারণ:
- `coverage_areas.location_id` already exists
- সব 622 area already linked
- main issue হলো UI/data derivation, schema না

## Preferred approach
আমি **derived/effective status** approach recommend করছি:
- safer
- instant
- parent on/off করলে correct reflect করবে
- manual area availability নষ্ট হবে না

### Alternative (not preferred)
Parent disable হলে DB-তে child `coverage_areas.available = false` লিখে দেওয়া।
এটা avoid করা ভালো, কারণ re-enable করলে কোন area আগে manually off ছিল আর কোনটা auto-off হয়েছিল—ওটা differentiate করা কঠিন হয়ে যাবে।
