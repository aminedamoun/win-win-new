/*
  # Create cv-uploads Storage Bucket

  1. Creates the `cv-uploads` storage bucket (private, not public)
  2. Adds storage policies:
     - Anyone (anon + authenticated) can upload to cv-uploads (needed for form submissions)
     - Only authenticated users (admins) can read/delete files
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv-uploads',
  'cv-uploads',
  false,
  5242880,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload CV files"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'cv-uploads');

CREATE POLICY "Authenticated users can read CV files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'cv-uploads');

CREATE POLICY "Authenticated users can delete CV files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'cv-uploads');
