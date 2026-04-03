

## Redesign Package Selection on New Connection Page

### Changes to `src/pages/NewConnection.tsx`

**1. Group packages by category with tabs/sections**
- Replace the single flat `<Select>` dropdown with a tabbed interface: **হোম** | **কর্পোরেট** | **ডেডিকেটেড**
- Use the existing `Tabs` component for category switching

**2. Shorter option labels**
- Format: `80Mbps @ ৳1050` instead of the verbose current format
- For Gbps speeds: `1Gbps @ ৳2500`

**3. Dedicated category — custom Mbps input**
- When "ডেডিকেটেড" tab is selected, hide the package dropdown
- Show an `<Input>` field where the user types their required Mbps (e.g. "100")
- Store this in a `dedicatedMbps` state, include it in `notes` JSON on submit

**4. State changes**
- Add `activeCategory` state (default `"home"`)
- Add `dedicatedMbps` state for the custom input
- Reset `packageId` when switching categories
- On submit: if dedicated, save `dedicatedMbps` in `notes`; otherwise save `package_id`

### Technical Notes
- No DB changes needed — dedicated Mbps goes into the existing `notes` text field as JSON
- Packages already have `category` field (`home`, `corporate`, `dedicated`)
- Imports: add `Tabs, TabsList, TabsTrigger, TabsContent` (already used in Packages page)

