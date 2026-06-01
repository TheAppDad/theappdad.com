# AdMob app-ads.txt — Cloudflare redirect fix

Google’s crawler checks **both** of these URLs (even when Marketing URL is `www`):

- `https://www.theappdad.com/app-ads.txt` ✅ (works)
- `https://theappdad.com/app-ads.txt` ❌ (currently redirects to `app.theappdad.com` → 404)

That second check is why AdMob verification keeps failing.

## Fix A — Cloudflare redirect rule (recommended)

In [Cloudflare Dashboard](https://dash.cloudflare.com) → zone **theappdad.com** → **Rules** → **Redirect Rules** → **Create rule**:

**Rule name:** `AdMob app-ads.txt to www`

**When incoming requests match** (Expression Editor):

```
(http.host eq "theappdad.com" and http.request.uri.path in {"/app-ads.txt" "/robots.txt"})
```

**Then:** Dynamic redirect  
**URL:** `concat("https://www.theappdad.com", http.request.uri.path)`  
**Status code:** 301 (or 302)

**Important:** This rule must run **before** your existing rule that sends all `theappdad.com` traffic to `app.theappdad.com`. Drag it higher in the list if needed.

After saving, verify:

```bash
curl -I https://theappdad.com/app-ads.txt
```

You should see `location: https://www.theappdad.com/app-ads.txt` (not `app.theappdad.com`).

Then in AdMob → **Check for updates**.

## Fix B — Serve files on app.theappdad.com

If you prefer not to change Cloudflare rules, add the same files to your **app.theappdad.com** deploy (`community/public/` in this repo) and redeploy that project. The crawler follows the redirect to `app.theappdad.com/app-ads.txt` and will pass if the file exists there.

Files added locally (not in marketing-site git — `community/` is gitignored):

- `community/public/app-ads.txt`
- `community/public/robots.txt`

Redeploy **app.theappdad.com** after adding them.

## After either fix

1. Wait up to 24 hours (Google’s stated crawl delay).
2. AdMob → Apps → app-ads.txt → **Check for updates**.
3. Confirm the **crawl URL** shown in AdMob’s detailed status matches a URL that returns the single-line file.
