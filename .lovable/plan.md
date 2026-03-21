

## Galaxy Net ISP Website — Full PRD Implementation Plan

### What Already Exists
- Home page (hero, features, packages teaser, about, testimonials, CTA)
- Packages page (home/business tabs, plan cards)
- Coverage page (area search, zone filters)
- Contact page (form, contact details)
- Navbar + Footer, Orange + Blue design system, bilingual support

### What Needs to Be Built / Enhanced

---

#### Phase 1: New Pages

**1. About Us Page (`/about`)**
- Company history section with timeline
- Team section with member cards (photo placeholder, name, role)
- "Why Choose Us" section with stats (clients, uptime, coverage %)
- Trust badges: BDIX, Fiber Optic, 99.9% Uptime

**2. Services Page (`/services`)**
- Service cards for: Broadband Internet, Corporate Internet, Dedicated Bandwidth, CCTV Solution, Network Setup
- Each card: icon, title (EN+BN), short description, CTA button

**3. New Connection / Order Page (`/order`)**
- Multi-step form: Name, Mobile, Address, Package selection (dropdown from existing plans), preferred installation date (date picker)
- Form validation with clear error states
- Success confirmation screen after submission

**4. Speed Test Page (`/speed-test`)**
- Embedded Ookla speed test widget (iframe from fast.com or speedtest.net embed)
- Tips section for improving speed

**5. Blog / Notices Page (`/notices`)**
- Static notice cards: maintenance alerts, fiber cut notices, offers/promotions
- Each card: date, title, category badge, description

---

#### Phase 2: Homepage Enhancements

- Add **Services preview** section (Broadband, Corporate, CCTV, Networking icons)
- Add **Coverage CTA** block ("Check if we're in your area" with inline search)
- Add **Trust stats bar** (99% uptime, 10K+ clients, 50+ areas, BDIX enabled)
- Add **BDIX / FTP / Gaming latency** highlight badges in hero or features
- Reorder sections: Hero → Stats Bar → Why Choose Us → Services → Packages → Coverage CTA → Testimonials → CTA

---

#### Phase 3: Conversion & UX Features

- **Sticky "Order Now" button** — fixed bottom bar on mobile with CTA
- **Floating WhatsApp button** — fixed bottom-right corner, links to WhatsApp
- **One-click call button** — in sticky bar and footer
- **Package cards** — add BDIX, FTP, YouTube/Facebook cache as feature badges

---

#### Phase 4: Navbar & Footer Updates

- **Navbar**: Add links for About, Services, Order Now. Reorganize: Home | Packages | Services | Coverage | About | Contact + "Order Now" CTA
- **Footer**: Add links to new pages (About, Services, Notices, Speed Test)

---

#### Phase 5: Packages Page Enhancement

- Add **speed range filter** (slider or buttons: 20Mbps, 50Mbps, 100Mbps+)
- Add **BDIX, FTP, Cache** badges on each plan card
- Rename "Subscribe Now" to "Order Now" linking to `/order`

---

#### Phase 6: Coverage Page Enhancement

- Add **District → Area dropdown** selectors alongside the existing search
- Show "Order Now" button when area is available, "Request Connection" when not

---

### Technical Approach

- All pages use existing shadcn/ui components (Card, Button, Input, Tabs, Badge, Select, Calendar/DatePicker, Sheet)
- Bilingual (EN + BN) throughout
- Mobile-first responsive design
- No backend needed — all static/client-side for now
- New routes added to `App.tsx`: `/about`, `/services`, `/order`, `/speed-test`, `/notices`
- Floating WhatsApp + sticky CTA as shared components

### File Changes Summary

| Action | File |
|--------|------|
| Create | `src/pages/About.tsx` |
| Create | `src/pages/Services.tsx` |
| Create | `src/pages/Order.tsx` |
| Create | `src/pages/SpeedTest.tsx` |
| Create | `src/pages/Notices.tsx` |
| Create | `src/components/FloatingWhatsApp.tsx` |
| Create | `src/components/StickyOrderBar.tsx` |
| Edit | `src/pages/Index.tsx` — add services, coverage CTA, trust stats, BDIX badges |
| Edit | `src/pages/Packages.tsx` — add filters, BDIX/FTP badges, link to /order |
| Edit | `src/pages/Coverage.tsx` — add dropdowns, Order/Request buttons |
| Edit | `src/components/Navbar.tsx` — add new page links |
| Edit | `src/components/Footer.tsx` — add new page links |
| Edit | `src/App.tsx` — add new routes |

