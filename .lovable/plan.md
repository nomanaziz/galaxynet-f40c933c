

## Fix Page Navigation Blinking/Jumping

### Problem
When navigating between pages, there's a visible "blink" or "jump." This happens because:
1. Each page includes its own `<TopBar>`, `<Navbar>`, and `<Footer>` — these unmount and remount on every route change, causing a flash.
2. Pages fetch data from Supabase on mount, briefly showing empty/loading states before content appears.

### Solution
**Move shared layout components out of individual pages into a shared Layout wrapper**, so Navbar/TopBar/Footer persist across navigations and never re-render. Only the page content area changes.

### Changes

**1. Create `src/components/Layout.tsx`** (new file)
- Wrap `<TopBar>`, `<Navbar>`, `<Outlet />`, and `<Footer>` in a single layout component.
- Navbar and Footer stay mounted across route changes — no unmount/remount blink.

```text
Layout.tsx
├── TopBar       (persistent)
├── Navbar       (persistent)
├── <Outlet />   (only this changes per route)
└── Footer       (persistent)
```

**2. Update `src/App.tsx`**
- Wrap public routes in a parent `<Route element={<Layout />}>` with nested child routes.
- Each page route becomes a child route rendered inside the Layout's `<Outlet>`.

**3. Update all public page files** (Index, Packages, Coverage, Contact, About, Services, Order, SpeedTest, Notices, Offers, Payment, Selfcare, Login, Register, NewConnection, NotFound)
- Remove `<TopBar>`, `<Navbar>`, and `<Footer>` imports and JSX from each page.
- Pages now only render their own unique content.

### Technical Details
- Roughly 16 page files will have their TopBar/Navbar/Footer removed (3 lines of imports + 3 lines of JSX each).
- The Layout component is simple — just TopBar + Navbar + Outlet + Footer with no state.
- This approach is standard React Router nested layout pattern and eliminates the re-mount flash entirely.
- Data-fetching flashes within page content will still exist but will be much less noticeable since the chrome (header/footer) stays stable.

