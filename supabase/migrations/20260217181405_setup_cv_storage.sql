/*
  # Set up CV Storage

  1. Storage Setup
    - Create 'cv-uploads' storage bucket for PDF files
    - Bucket is private (not publicly accessible)
  
  2. Security Policies
    - Allow public uploads to cv-uploads bucket (for application submissions)
    - Only authenticated users can view/download CVs
*/

-- Create storage bucket for CV files
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-uploads', 'cv-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload CVs (needed for public job applications)
CREATE POLICY "Anyone can upload CVs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'cv-uploads');

-- Only authenticated users can view CVs
CREATE POLICY "Authenticated users can view CVs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'cv-uploads');
