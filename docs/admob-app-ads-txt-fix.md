# AdMob app-ads.txt & sellers.json domain — Cloudflare redirect fix

Google’s crawler checks **both** hostnames (even when Marketing URL is `www`):

- `https://www.theappdad.com/app-ads.txt` ✅ (works)
- `https://theappdad.com/app-ads.txt` ❌ unless redirected to `www` (not `app.theappdad.com`)

**sellers.json “Can’t verify theappdad.com”** uses the **apex** domain. It checks `https://theappdad.com/ads.txt` (web `ads.txt`, not `app-ads.txt`). Today that URL redirects to `app.theappdad.com/ads.txt` and returns HTML → verification fails.

Fix: host `ads.txt` on **www** (same publisher line as `app-ads.txt`) and redirect apex `/ads.txt` to www (see rule below).

## Fix A — Cloudflare redirect rule (recommended)

In [Cloudflare Dashboard](https://dash.cloudflare.com) → zone **theappdad.com** → **Rules** → **Redirect Rules** → **Create rule**:

**Rule name:** `AdMob app-ads.txt to www`

**When incoming requests match** (Expression Editor):

```
(http.host eq "theappdad.com" and http.request.uri.path in {"/app-ads.txt" "/ads.txt" "/robots.txt"})
```

**Then:** Dynamic redirect  
**URL:** `concat("https://www.theappdad.com", http.request.uri.path)`  
**Status code:** 301 (or 302)

**Important:** This rule must run **before** your existing rule that sends all `theappdad.com` traffic to `app.theappdad.com`. Drag it higher in the list if needed.

After saving, verify:

```bash
curl -I https://theappdad.com/app-ads.txt
curl -I https://theappdad.com/ads.txt
curl -s  https://www.theappdad.com/ads.txt
```

You should see redirects to `https://www.theappdad.com/...` (not `app.theappdad.com`), and the `ads.txt` body must be the single `google.com, pub-5244460225188024, ...` line.

Then in AdMob → **Check for updates** (app-ads.txt) and **Verify** again on sellers.json (may take up to 24 hours).

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
