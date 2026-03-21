

## Redesign Payment Page + Enhanced Admin Management

### Reference Image Analysis
The reference shows payment methods as large cards with: colored logo area, Bengali name, description text, and a colored "বিস্তারিত জানুন →" button. Each card has a distinct brand color.

### Database Migration

Add new columns to `payment_methods`:

| Column | Type | Purpose |
|--------|------|---------|
| `name_bn` | text | Bengali name (e.g. বিকাশ) |
| `instructions_bn` | text | Bengali instructions |
| `button_text` | text | Button label (default: "বিস্তারিত জানুন") |
| `button_text_bn` | text | Bengali button label |
| `button_url` | text | Link URL for the button |
| `bg_color` | text | Brand color for the card accent (e.g. #E2136E for bKash) |
| `screenshot_url` | text | Screenshot/detail image URL |

### Files to Change

| File | Change |
|------|--------|
| `src/pages/Payment.tsx` | Redesign to match reference: large card grid (4 cols), big logo with colored background, Bengali name, description, colored CTA button |
| `src/pages/admin/PaymentManager.tsx` | Add all new fields to the form dialog: name_bn, instructions_bn, button text/url, bg_color (color picker input), screenshot URL. Add image upload for logo and screenshot using the `media` bucket |

### Payment Page Design (Public)
- 4-column responsive grid (1 col mobile, 2 tablet, 4 desktop)
- Each card: rounded with subtle shadow, large logo area with `bg_color` background, name (Bengali), description text, colored CTA button with arrow
- Clicking button links to `button_url` or opens a modal showing the screenshot with payment instructions and account number details

### Admin PaymentManager Enhancements
- Add Name (BN), Instructions (BN) fields
- Add Button Text, Button Text (BN), Button URL fields
- Add Background Color field (text input with color preview)
- Add Screenshot URL field
- Show logo preview in the table

