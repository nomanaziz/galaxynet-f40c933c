

## Change CTA "Contact Us" Button to Orange

The white outline button in the bottom CTA banner section needs to match the orange style of the "Check Coverage" button.

### Change in `src/pages/Index.tsx` (line 321)

Replace the white outline styling with orange solid styling:
- From: `variant="outline" className="border-white/40 text-white hover:bg-white/10 font-semibold px-8"`
- To: `className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8"`

Single line change in one file.

