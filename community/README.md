# The App Dads — community app

Next.js 15 (App Router) + Clerk + Tailwind. Dark UI aligned with [theappdad.com](https://www.theappdad.com) (Outfit + `#4a7c59` accent).

## Local setup

1. **Install** (from repo root or `community/`):

   ```bash
   cd community && npm install
   ```

2. **Clerk** — [dashboard.clerk.com](https://dashboard.clerk.com) → create application → copy keys.

3. **Env** — copy `.env.example` to `.env.local` and fill in:

   ```bash
   cp .env.example .env.local
   ```

4. **Run** (port `3001` so it doesn’t clash with other dev servers):

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3001](http://localhost:3001).

### If the app “won’t load” or protected routes spin forever

- Use **port 3001** (`http://localhost:3001`), not 3000.
- In `.env.local`, set the **`NEXT_PUBLIC_CLERK_SIGN_IN_URL`** / **`SIGN_UP_URL`** / **`AFTER_SIGN_*`** vars (see `.env.example`). Without them, Clerk’s dev handshake can misbehave.
- In [Clerk Dashboard](https://dashboard.clerk.com) → your app → **Domains**, allow **`http://localhost:3001`** (and `http://127.0.0.1:3001` if you use it).
- Stop the dev server, run `rm -rf .next`, then `npm run dev` again. If port 3001 is busy: `lsof -i :3001` → `kill <pid>`.

### Postgres (Neon) — do this right after Clerk

This is the **next logical step**: a real database unlocks dashboard counts, membership flags, and (later) CSV export + audit.

1. Create a free project at [neon.tech](https://neon.tech) (or use Supabase Postgres — same `DATABASE_URL` idea).
2. In Neon: **Dashboard** → your project → **Connect** → copy the **pooled** connection string (starts with `postgresql://…`). It should include `sslmode=require`.
3. Add to `.env.local`:

   ```bash
   DATABASE_URL=postgresql://...
   ```

4. From `community/`, push the schema to the empty database:

   ```bash
   npm run db:push
   ```

   Confirm when the CLI asks to create tables `profiles` and `export_audit`.

5. Restart `npm run dev`, sign in, open **Dashboard**. You should see **The App Dads** show a count like `0` (not `—`) and a **profiles** row is created for your Clerk user on first load.

**Optional:** `npm run db:studio` opens Drizzle Studio against the same `DATABASE_URL` so you can inspect rows.

**Manual test:** In Studio or Neon SQL editor, set your row’s `in_collective` to `true`. Reload the dashboard — The App Dads count increases and the export card moves past the “join The App Dads” state (CSV still returns `503` until that route is implemented).

### Clerk providers

Enable **Google**, **Apple**, **GitHub**, and **Email** in Clerk Dashboard → User & Authentication → Social connections (and email).

### Username yes — first / last name no

The sign-up form is controlled in the **Clerk Dashboard**, not in this repo.

1. Open [Clerk Dashboard](https://dashboard.clerk.com) → your App Dads application.
2. Go to **User & authentication** (or **Configure** → **User & authentication**).
3. **Username**
   - Turn **Username** **on**.
   - If you see an option to require it at sign-up, enable that so every member picks a handle (for `/community/[username]` later).
4. **User model** (same area — sometimes called **Profile** / **Attributes**)
   - Turn **off** **“Allow users to set their first and last name”** (or equivalent). That removes the name fields from sign-up.
5. Save.

**OAuth note:** Google/Apple may still *supply* a name to Clerk in the background. Turning the setting off means users are **not asked** to enter or edit first/last name in your flow. If a name still appears on their Clerk profile, you can trim that later in the **User profile** / component settings.

Default Clerk usernames are **4–64** characters (letters/numbers; limited special chars). Your product spec asked for 3–20 — either align your rules to Clerk’s defaults or adjust username length in the Dashboard if your plan offers it.

## Deploy

- **Vercel** (simplest): import repo, set root directory to `community`, add env vars, attach domain e.g. `community.theappdad.com`.
- **Cloudflare**: use [OpenNext](https://opennext.js.org/) or a second Pages project; Clerk needs the deployed URL in allowed origins.

Update the main site nav link in `index.html` if your community URL is not `https://community.theappdad.com`.

## What’s implemented (v0)

- Public **`/community`** pulse: App Dads counts, new members (7d), Play pool, **self-reported** apps in review / distributed (`app_store_reports` table + dashboard form)
- Public landing with **The App Dads** + **Play pool** counts (Google emails synced in DB)
- Clerk sign-in / sign-up (dark-themed)
- Protected **Dashboard** + **Onboarding** (form sets `building_summary`, `platforms`, `onboarding_completed_at`, `in_collective`)
- **Postgres** (`profiles`, `export_audit`) via **Drizzle** + **Neon serverless** when `DATABASE_URL` is set  
  - `profiles.google_play_email` is filled from Clerk when a member opens the **dashboard** with Google linked
- **`POST /api/export/csv`** — requires **app name** in JSON body; stores **username**, app name, exporter email, **`followup_due_at`** (export + **15 days**). Up to **25** emails, **15+** Play-pool members, **7-day** export cooldown.
- **Distribution follow-up** — after 15 days, dashboard prompts **Yes, ready / Not yet**; **`POST /api/export/followup`** saves the answer. Optional **email** via [Resend](https://resend.com) + daily **`GET /api/cron/export-followup-reminders`** (Bearer **`CRON_SECRET`**; `vercel.json` schedules 09:00 UTC on Vercel).
- Draft **Terms** and **Privacy** pages (replace before launch)

After pulling schema changes, run **`npm run db:push`** from `community/` (adds columns such as `google_play_email`).

## Next implementation steps

1. **Clerk webhook** — sync `google_play_email` when Google is linked (so a dashboard visit isn’t required)  
2. Noticeboard + directory  
3. Production deploy + legal review
