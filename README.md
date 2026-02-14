# theappdad.com

Indie app developer website for The App Dad (Andrew Webster).

## Structure

- **`index.html`** + **`styles.css`** — Main site (hero, apps, "The reality", about)
- **"The reality"** — Stats are loaded from a Google Sheet. See setup below.
- **`chosen-legal-pages/`** — Privacy, Support, and Terms pages (deploy to [Chosen-Right-App](https://github.com/TheAppDad/Chosen-Right-App) for GitHub Pages)

## "The reality" — Updating stats

Stats are loaded from `stats.csv`. To update:

1. **From App Store Connect** → copy your latest numbers
2. Edit `stats.csv` — update the second row (keep the header row as-is). Update `last_updated` (e.g. `14 Feb 2026`)
3. Commit and push — the site updates on deploy

**CSV columns:** `impressions`, `product_page_views`, `conversion_rate`, `downloads`, `proceeds`, `proceeds_per_user`, `sessions_per_device`, `crashes`, `months`, `last_updated`

If the fetch fails, the HTML has fallback values so numbers still display.

**Apple Numbers:** Export your spreadsheet to CSV, copy the data row, paste into `stats.csv`.

## Deployment

Main site deploys via **Cloudflare Pages** → Connect this repo, add custom domain `theappdad.com`.
