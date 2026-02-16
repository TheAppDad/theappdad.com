# Cloudflare Pages Setup for App Store Rating (Functions)

Follow these steps so your App Store rating loads automatically via the `/api/rating` endpoint.

---

## Step 1: Open Your Project

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click **Workers & Pages**
3. Click your **theappdad.com** (or theappdad) project

---

## Step 2: Check Build Settings

1. Click **Settings**
2. Scroll to **Build configurations**
3. Set:
   - **Build command:** `exit 0`
   - **Build output directory:** leave **blank** (or `/` if blank is not allowed)

**Why:** A blank output directory tells Cloudflare to use the repo root as both the static site and Functions source. That keeps your `functions/` folder at the deploy root.

4. Click **Save**

---

## Step 3: Confirm Functions Are Included

1. In **Settings**, scroll to **Functions**
2. Check that **Functions** is **Enabled**
3. Confirm the **Functions root directory** is `functions` (or empty, meaning Cloudflare detects the `functions` folder automatically)

---

## Step 4: Trigger a New Deploy

After changing build settings:

1. Go to the **Deployments** tab
2. Click the **…** menu on the latest deployment
3. Click **Retry deployment**

Or push a new commit to trigger a fresh build.

---

## Step 5: Check the API

1. After the deploy finishes, open:
   ```
   https://www.theappdad.com/api/rating
   ```
   or
   ```
   https://theappdad-com.pages.dev/api/rating
   ```

2. You should see JSON like:
   ```json
   {"rating":5,"count":3}
   ```

3. If you see a 404 or HTML, the Function is not running yet. Recheck Steps 2–3 and redeploy.

---

## Step 6: If the Build Fails

If the build fails with “Build output directory not found”:

1. Go to **Settings** → **Build configurations**
2. Set **Build command** to `exit 0`
3. Set **Build output directory** to `.` (current directory)
4. Save and redeploy

---

## Step 7: Verify the Rating on the Site

1. Open your homepage
2. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
3. The section should show: **Current App Store review score: ★★★★★ 5.0 (3 ratings)**

---

## Troubleshooting

| Symptom | Check |
|--------|--------|
| `/api/rating` returns 404 | Build output directory is likely wrong; try `.` or blank |
| Rating stuck on "…" | Confirm `/api/rating` returns JSON in a new tab |
| Functions not enabled | Settings → Functions → make sure they are enabled |

---

## Folder Layout in the Repo

Your repo should look like this:

```
theappdad.com/
├── functions/
│   └── api/
│       └── rating.js    ← API proxy
├── index.html
├── analytics.js
├── styles.css
├── _routes.json
└── ...
```

With the build output set to the repo root (or `.`), Cloudflare deploys both the static files and `functions/` correctly.
