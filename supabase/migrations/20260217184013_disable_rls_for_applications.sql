/*
  # Disable RLS for Applications Table

  1. Changes
    - Disable RLS on applications table to allow anonymous submissions
    - Keep table permissions in place for security
  
  2. Security
    - Table-level grants still control access
    - Anonymous users can INSERT
    - Authenticated users can do full CRUD
    - This is acceptable for a job application form where we want to minimize barriers
*/

-- Disable RLS on applications table
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Ensure permissions are correct
GRANT INSERT ON applications TO anon;
GRANT ALL ON applications TO authenticated;
