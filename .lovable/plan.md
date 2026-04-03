

## Simplify New Connection Landing Page & Add Engagement Content

### What changes
**File: `src/pages/NewConnection.tsx`**

**Remove these fields and related code:**
- Email field (lines 150-153)
- Service type radio group + `serviceOptions` array (lines 16-23, 155-166)
- NID field (lines 168-172)
- DOB field + Calendar/Popover imports (lines 174-195)
- Remove unused imports: `RadioGroup`, `RadioGroupItem`, `Calendar`, `Popover`, `PopoverContent`, `PopoverTrigger`, `CalendarIcon`, `format`, `cn`
- Remove unused state: `email`, `serviceType`, `nid`, `dob`

**Keep only 4 fields:**
1. আপনার নাম (Name) *
2. এলাকা নির্বাচন করুন (Area) *
3. আপনার ঠিকানা (Address)
4. ফোন নাম্বার (Phone) *

**Add engagement content above the form:**
- 3 small trust/benefit cards below the hero text: "⚡ লাইটনিং ফাস্ট স্পিড", "🛡️ ২৪/৭ সাপোর্ট", "💰 সাশ্রয়ী মূল্য" — compact horizontal row with icons
- A short tagline: "১০,০০০+ সন্তুষ্ট গ্রাহক আমাদের উপর আস্থা রাখেন"

**Add engagement content below the form:**
- A "কেন Galaxy Net?" section with 3 bullet points: ফাইবার অপটিক কানেকশন, ক্যাশ সার্ভার সুবিধা, দ্রুত ইনস্টলেশন

**Update `notesData`** to only include `source: "landing_page"` (remove service_type, nid, dob). Remove `email` from the insert call.

