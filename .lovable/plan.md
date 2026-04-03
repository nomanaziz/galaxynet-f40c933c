

## Fix 404 on Vercel for galaxynetbd.com

### Problem
Vercel doesn't know this is a Single Page Application (SPA), so when users visit routes like `/packages` or `/about` directly, Vercel returns a 404 instead of serving `index.html` and letting React Router handle the route.

### Solution
Create a `vercel.json` file in the project root with SPA rewrites configuration.

### Changes

**1. Create `vercel.json` (project root)**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This single file tells Vercel to serve `index.html` for all routes that don't match a static file, allowing React Router to handle client-side routing.

### Vercel Project Settings
Make sure in your Vercel dashboard:
- **Framework Preset**: Vite
- **Build Command**: `npm run build` (or `bun run build`)
- **Output Directory**: `dist`

### Custom Domain
Ensure `galaxynetbd.com` is added in Vercel → Project Settings → Domains with correct DNS:
- **A Record**: `@` → `76.76.21.21`
- **CNAME**: `www` → `cname.vercel-dns.com`

