/*
  # Create applications table

  ## Summary
  The codebase references `public.applications` but the database only has `public.job_applications`
  with different column names. This migration creates the correct `applications` table that both
  the apply form and admin page expect.

  ## New Table: applications
  - id (uuid, primary key, auto-generated)
  - created_at (timestamptz, default now())
  - first_name (text, not null)
  - last_name (text, not null)
  - email (text, not null)
  - phone (text, not null)
  - job_id (uuid, nullable FK to jobs)
  - preferred_interview_time (text)
  - message (text)
  - cv_url (text) — storage path for uploaded CV
  - status (text, default 'new')

  ## Security
  - RLS enabled
  - anon can INSERT (public apply form)
  - authenticated can SELECT, UPDATE (admin page)
*/

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  preferred_interview_time text DEFAULT '',
  message text DEFAULT '',
  cv_url text DEFAULT '',
  status text DEFAULT 'new'
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon users can submit applications"
  ON applications FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view applications"
  ON applications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update application status"
  ON applications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
