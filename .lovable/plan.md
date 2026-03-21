

## Remove Speed Filter from Packages Page

The speed filter section (slider + label showing "গতি অনুযায়ী: সব") will be removed entirely.

### Changes

**`src/pages/Packages.tsx`**
- Remove the `speedFilter` state and `Slider` import
- Remove the filter `<div>` block (the slider UI between tabs and grid)
- Simplify `filterPlans` to just filter by category without speed filtering

