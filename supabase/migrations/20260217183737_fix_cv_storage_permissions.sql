/*
  # Fix CV Storage Permissions

  1. Changes
    - Grant anon role permissions to upload files to cv-uploads bucket
    - Ensure storage policies allow anonymous uploads
  
  2. Security
    - Allow anonymous users to upload CVs to cv-uploads bucket only
    - Restrict file size to 5MB (handled in application logic)
*/

-- Grant anon access to storage schema objects
GRANT INSERT ON storage.objects TO anon;
GRANT SELECT ON storage.buckets TO anon;

-- Drop existing storage policies for cv-uploads
DROP POLICY IF EXISTS "Anyone can upload CVs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view CV uploads" ON storage.objects;

-- Create policy for anonymous CV uploads
CREATE POLICY "Allow anonymous CV uploads"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'cv-uploads');

-- Create policy for viewing uploaded CVs
CREATE POLICY "Allow viewing CV uploads"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'cv-uploads');
