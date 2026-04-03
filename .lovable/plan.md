

## Add Quick Bill Pay Section to Payment Page

### Overview
Add a prominent "Quick Bill Pay" section at the top of the Payment page. Users enter their Client Code and get redirected to `https://portal.galaxynetbd.com/BillPayment/Index` with the code pre-filled via URL parameter.

### Changes to `src/pages/Payment.tsx`

**1. Add Quick Bill Pay section above payment methods**
- New section with a styled card containing:
  - Heading: "Quick Bill Pay" / "দ্রুত বিল পরিশোধ"
  - Input field labeled "Client Code" / "ক্লায়েন্ট কোড"
  - "Pay Now" / "বিল পরিশোধ করুন" button
- Styled with accent background, centered layout

**2. Behavior**
- User types their Client Code in the input
- On click "Pay Now", opens `https://portal.galaxynetbd.com/BillPayment/Index` in a new tab
- Basic validation: require non-empty client code before enabling the button

**3. State additions**
- `clientCode` string state for the input field

### Technical Notes
- No DB changes needed
- The portal URL is opened in a new tab — the external portal handles the actual payment
- Input validated client-side (non-empty, trimmed)

