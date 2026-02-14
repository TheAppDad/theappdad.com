# theappdad.com

Indie app developer website for The App Dad (Andrew Webster).

## Structure

- **`index.html`** + **`styles.css`** — Main site (hero, apps, "The reality", about)
- **"The reality"** — Stats are loaded from a Google Sheet. See setup below.
- **`chosen-legal-pages/`** — Privacy, Support, and Terms pages (deploy to [Chosen-Right-App](https://github.com/TheAppDad/Chosen-Right-App) for GitHub Pages)

## "The reality" — Updating stats

Stats are loaded from `stats.csv`. To update:

1. **From App Store Connect** → copy your latest numbers
2. Edit `stats.csv` — replace the values in the second row (keep the header row as-is)
3. Commit and push — the site updates on deploy

**CSV columns** (must match exactly):  
`impressions`, `product_page_views`, `conversion_rate`, `downloads`, `proceeds`, `proceeds_per_user`, `sessions_per_device`, `crashes`, `months`

**Apple Numbers:** Export your spreadsheet to CSV, copy the data row, paste into `stats.csv`.

## Deployment

Main site deploys via **Cloudflare Pages** → Connect this repo, add custom domain `theappdad.com`.
