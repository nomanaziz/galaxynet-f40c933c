

## Seed All Bangladeshi Festival Themes with Generated Hero Images

### Overview
Insert all major Bangladeshi festivals into the `festival_themes` table with appropriate theming (colors, decorations, greetings) and generate themed hero images for each festival using AI image generation, then upload them to the existing `media` Supabase storage bucket.

### Festivals to Add (2025-2026 dates)

| # | Festival | Bangla | Dates | Decoration | Gradient | Ramadan? |
|---|----------|--------|-------|------------|----------|----------|
| 1 | Ramadan | রমজান | Mar 1 – Mar 30, 2026 | stars | Dark blue → Deep purple | Yes |
| 2 | Eid ul-Fitr | ঈদ উল ফিতর | Mar 31 – Apr 2, 2026 | lanterns | Gold → Deep green | No |
| 3 | Pohela Boishakh | পহেলা বৈশাখ | Apr 14 – Apr 15, 2026 | alpana | Red → Deep orange | No |
| 4 | Shab-e-Barat | শবে বরাত | Jan 15 – Jan 16, 2026 | stars | Indigo → Purple | No |
| 5 | Eid ul-Adha | ঈদ উল আযহা | Jun 7 – Jun 9, 2026 | lanterns | Emerald → Teal | No |
| 6 | Independence Day | স্বাধীনতা দিবস | Mar 26 – Mar 26, 2026 | confetti | Green → Red | No |
| 7 | Victory Day | বিজয় দিবস | Dec 16 – Dec 16, 2025 | confetti | Green → Red | No |
| 8 | International Mother Language Day | আন্তর্জাতিক মাতৃভাষা দিবস | Feb 21 – Feb 21, 2026 | lights | Red → Dark red | No |
| 9 | Durga Puja | দুর্গা পূজা | Oct 2 – Oct 7, 2025 | lights | Saffron → Crimson | No |
| 10 | Christmas | বড়দিন | Dec 25 – Dec 25, 2025 | lights | Red → Green | No |
| 11 | New Year | নববর্ষ | Jan 1 – Jan 1, 2026 | confetti | Navy → Gold | No |

### Hero Image Generation

For each festival, generate a themed banner/hero image (1920x600) using an AI image generation approach:
- Use a Python script with Pillow to create gradient-based hero banners with festival-themed patterns, text overlays, and decorative elements
- Each image will have the festival gradient as background, with subtle pattern overlays matching the decoration type
- Upload each to the `media` bucket in Supabase storage at path `festivals/{slug}.png`
- Store the public URL in `hero_image_url`

### Implementation Steps

1. **Generate hero images** — Python script using Pillow to create 11 themed gradient banners with decorative patterns (geometric for alpana, crescent/stars for Eid/Ramadan, confetti dots for national days, etc.) and bilingual text overlays
2. **Upload to Supabase storage** — Upload each image to `media` bucket under `festivals/` folder
3. **Insert festival data** — SQL migration or direct insert with all festival rows including the storage URLs
4. **Verify** — Query the table and check images are accessible

### Technical Details

- Images generated programmatically with Pillow (no external AI API needed)
- Each image: 1920x600px PNG with gradient background + SVG-style decorative elements + festival name text
- Uploaded via Supabase Storage REST API using the anon key
- All festivals inserted with `enabled: true` so they auto-activate on their dates

