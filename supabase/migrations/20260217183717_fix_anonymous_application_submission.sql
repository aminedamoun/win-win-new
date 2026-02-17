/*
  # Fix Anonymous Application Submission

  1. Changes
    - Drop all existing policies on applications table
    - Create new policy that allows anonymous (anon) users to insert applications
    - Grant necessary permissions to anon role
  
  2. Security
    - Allow anonymous users to submit applications (INSERT only)
    - Authenticated users can view, update, and delete applications
    - No restrictions on anonymous submissions to enable easy job applications
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can submit applications" ON applications;
DROP POLICY IF EXISTS "Authenticated users can view applications" ON applications;
DROP POLICY IF EXISTS "Authenticated users can update applications" ON applications;
DROP POLICY IF EXISTS "Authenticated users can delete applications" ON applications;

-- Grant INSERT permission to anon role on applications table
GRANT INSERT ON applications TO anon;

-- Grant SELECT on jobs table so foreign key checks work
GRANT SELECT ON jobs TO anon;

-- Create policy for anonymous application submissions
CREATE POLICY "Allow anonymous application submissions"
  ON applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy for authenticated users to view applications
CREATE POLICY "Authenticated users can view all applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for authenticated users to update applications
CREATE POLICY "Authenticated users can update all applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy for authenticated users to delete applications
CREATE POLICY "Authenticated users can delete all applications"
  ON applications
  FOR DELETE
  TO authenticated
  USING (true);
