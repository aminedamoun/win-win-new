-- =============================================================================
-- Win Win — Fresh Supabase project bootstrap
-- =============================================================================
-- Run this file ONCE, in the SQL editor of a brand-new Supabase project,
-- after creating the project. It is idempotent: safe to re-run.
--
-- Replaces the old project (owvufovfnngqdhbscoci, deleted). Consolidates
-- and supersedes everything in supabase/migrations/, which evolved through
-- multiple "fix" migrations on the old project.
--
-- After running this:
--   1. Set Edge Function secrets (RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
--   2. Deploy the send-application-email function:
--        supabase functions deploy send-application-email --project-ref <new-ref>
--   3. Create an admin user in Authentication → Users (for /admin/applications)
--   4. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY on the deploy host
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. jobs table
--    Used by:
--      - assets/js/jobs-db.js (getAllJobs, getJobBySlug — anon read)
--      - assets/js/apply.js (look up job_id when submitting an application)
--      - admin/applications.html (filter + display job titles)
--    Note: the public careers listing reads jobs from Contentful, not from here.
--    This table exists so the admin panel can attribute applications to jobs.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  slug          text NOT NULL UNIQUE,
  title_en      text NOT NULL DEFAULT '',
  title_sl      text NOT NULL DEFAULT '',
  is_active     boolean NOT NULL DEFAULT true
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon can read active jobs" ON public.jobs;
CREATE POLICY "Anon can read active jobs"
  ON public.jobs FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated can manage jobs" ON public.jobs;
CREATE POLICY "Authenticated can manage jobs"
  ON public.jobs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 2. applications table
--    Anon INSERT (the public apply form), authenticated SELECT/UPDATE (admin).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at               timestamptz NOT NULL DEFAULT now(),
  first_name               text NOT NULL DEFAULT '',
  last_name                text NOT NULL DEFAULT '',
  email                    text NOT NULL DEFAULT '',
  phone                    text NOT NULL DEFAULT '',
  job_id                   uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  preferred_interview_time text DEFAULT '',
  message                  text DEFAULT '',
  cv_url                   text DEFAULT '',
  status                   text NOT NULL DEFAULT 'new'
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon can submit applications" ON public.applications;
CREATE POLICY "Anon can submit applications"
  ON public.applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can view applications" ON public.applications;
CREATE POLICY "Authenticated can view applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated can update applications" ON public.applications;
CREATE POLICY "Authenticated can update applications"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 3. cv-uploads storage bucket
--    Private (admin/edge-function read only), 5MB limit, PDFs only.
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cv-uploads', 'cv-uploads', false, 5242880, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Anon can upload CV files" ON storage.objects;
CREATE POLICY "Anon can upload CV files"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'cv-uploads');

DROP POLICY IF EXISTS "Authenticated can read CV files" ON storage.objects;
CREATE POLICY "Authenticated can read CV files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'cv-uploads');

DROP POLICY IF EXISTS "Authenticated can delete CV files" ON storage.objects;
CREATE POLICY "Authenticated can delete CV files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'cv-uploads');

-- ---------------------------------------------------------------------------
-- 4. Seed jobs (matches the two JSON files in /content/jobs/)
--    Safe to keep — UPSERT on slug. Deactivate or delete in dashboard later.
-- ---------------------------------------------------------------------------
INSERT INTO public.jobs (slug, title_en, title_sl, is_active) VALUES
  ('customer-service-representative',
   'Sales Consultant – Field Sales',
   'Prodajni svetovalec – Terenska prodaja',
   true),
  ('warehouse-worker-full-time',
   'Sales Consultant – Telecommunications Package Sales in Shopping Centers',
   'Prodajni svetovalec – Prodaja telekomunikacijskih paketov v nakupovalnih centrih',
   true)
ON CONFLICT (slug) DO UPDATE SET
  title_en  = EXCLUDED.title_en,
  title_sl  = EXCLUDED.title_sl,
  is_active = EXCLUDED.is_active;
