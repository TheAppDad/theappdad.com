# theappdad.com

Indie app developer website for The App Dad (Andrew Webster).

## Structure

- **`index.html`** + **`styles.css`** — Main site (hero, apps, "The reality", about)
- **`app-dads/`** — “Coming soon” landing for **The App Dads** (linked from main nav)
- **"The reality"** — Stats loaded from `stats.csv` with history and trend indicators.
- **`chosen-legal-pages/`** — Privacy, Support, and Terms pages (deploy to [Chosen-Right-App](https://github.com/TheAppDad/Chosen-Right-App) for GitHub Pages)

### The App Dads (community app)

The **members / dashboard** Next.js app is **not tracked in this repo** so this project stays scoped to the public marketing site. Keep that work in a local `community/` folder (gitignored), or move it to its own repository when you are ready to deploy (e.g. `community.theappdad.com`). The main site nav already links out to that URL.

## "The reality" — Updating stats

Stats are loaded from `stats.csv`. To update:

1. **From App Store Connect** → copy your latest numbers
2. Edit `stats.csv` — **add a new row at the top** (below the header). Keep previous rows for history.
3. Update `last_updated` (e.g. `19 Feb 2026`) and the date_range column to match
4. Commit and push — the site updates on deploy

**Trends:** The site computes % change vs the previous snapshot. Green = up, red = down.

**CSV columns:** `impressions`, `product_page_views`, `conversion_rate`, `downloads`, `proceeds`, `proceeds_per_user`, `sessions_per_device`, `crashes`, `months`, `last_updated`, `period`, `date_range`

If the fetch fails, the HTML has fallback values so numbers still display.

## Deployment

Main site deploys via **Cloudflare Pages** → Connect this repo, add custom domain `theappdad.com`.
