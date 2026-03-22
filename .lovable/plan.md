

## Add Missing TopBar to Services, Contact, and About Pages

### Problem
The TopBar (showing the scrolling notice and hotline) is missing from three pages: Services, Contact, and About. All other public pages already have it.

### Changes

| File | Change |
|------|--------|
| `src/pages/Services.tsx` | Add `import TopBar from "@/components/TopBar"` and render `<TopBar />` before `<Navbar />` |
| `src/pages/Contact.tsx` | Add `import TopBar from "@/components/TopBar"` and render `<TopBar />` before `<Navbar />` |
| `src/pages/About.tsx` | Add `import TopBar from "@/components/TopBar"` and render `<TopBar />` before `<Navbar />` |

Three small edits — add one import line and one JSX element to each file.

