# Supabase cutover — Win Win

The old project (`owvufovfnngqdhbscoci`) is fully deleted; nothing to migrate. This is a clean rebuild on a new free Supabase project.

## What's already prepared in this repo

- [supabase/setup.sql](supabase/setup.sql) — single idempotent script that creates `jobs`, `applications`, the `cv-uploads` bucket, RLS policies, and seeds the two existing jobs from `content/jobs/`.
- [admin/applications.html](admin/applications.html) — now reads `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` from build-time env vars (no more hardcoded URL).
- [supabase/functions/send-application-email/](supabase/functions/send-application-email/) — edge function source, ready to deploy.

## Steps the user runs

### 1. Create the new Supabase project
- supabase.com/dashboard → **New project** (free tier).
- Pick region **Frankfurt** (closest to win-win.si).
- Save the database password somewhere safe.

### 2. Run the schema
- Project → **SQL editor** → New query.
- Paste the contents of [supabase/setup.sql](supabase/setup.sql) → **Run**.
- Verify under **Table editor** that `jobs` (with 2 rows) and `applications` (empty) exist, and **Storage** has a `cv-uploads` bucket.

### 3. Grab the keys
- Project → **Settings → API**:
  - `Project URL` → `https://<ref>.supabase.co`
  - `anon public` key
  - `service_role` key (secret — never put in frontend)

### 4. Create an admin user (for /admin/applications)
- Project → **Authentication → Users → Add user → Create new user**.
- Email + password — these are what you use to log in to the admin panel.

### 5. Deploy the edge function
Requires the Supabase CLI (`brew install supabase/tap/supabase`).

```bash
cd /Users/aminedamoun/win-win-new
supabase login
supabase link --project-ref <new-ref>

# Set secrets the function reads at runtime
supabase secrets set RESEND_API_KEY=<your-resend-api-key>
# SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected by Supabase

supabase functions deploy send-application-email
```

`RESEND_API_KEY` — get from resend.com (the existing Win Win Resend account that sends from `noreply@win-win.si`). If lost, create a new key in the Resend dashboard.

### 6. Set env vars on the deploy host
The site is built with Vite — env vars must be present **at build time**, not runtime.

**If on Netlify** (matches `netlify.toml` in the repo):
- Site settings → **Environment variables** → add:
  - `VITE_SUPABASE_URL` = the new project URL
  - `VITE_SUPABASE_ANON_KEY` = the new anon key
  - (Keep existing `VITE_CONTENTFUL_*` as-is.)
- Trigger a redeploy: **Deploys → Trigger deploy → Deploy site**.

**If on Vercel**:
- Project → **Settings → Environment Variables** → add the same two for **Production** (and Preview if you want).
- **Deployments → ⋯ → Redeploy** the latest production deploy.

### 7. Smoke test
1. Open the live site → `/prijava/` (or any `/pozicija/<slug>/` → Apply).
2. Submit a real test application with a small PDF.
3. Confirm three things:
   - The success message appears.
   - `office@win-win.si` receives the email with the PDF attached.
   - In the new Supabase project, **Table editor → applications** has a new row, and **Storage → cv-uploads** has the PDF.

## Things that did NOT carry over (because the old project is gone)

- Historical applications (the `applications` rows from before the cutover).
- Historical CV files in storage.
- Any admin users — re-create them in step 4.
- Custom jobs added via the old admin — re-add them in **Table editor → jobs**, or via the CMS once that's wired up.

## Rollback

There is nothing to roll back to (old project is deleted). If the new project misbehaves, fix it in place — don't try to "go back".
