/*
  # Completely Fix Applications RLS

  1. Changes
    - Disable RLS temporarily
    - Re-enable RLS with correct policies
    - Add policy for public role (which includes anon)
  
  2. Security
    - Allow ALL users (including anonymous) to submit applications
    - Authenticated users can manage applications
*/

-- First, disable RLS
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow anonymous application submissions" ON applications;
DROP POLICY IF EXISTS "Authenticated users can view all applications" ON applications;
DROP POLICY IF EXISTS "Authenticated users can update all applications" ON applications;
DROP POLICY IF EXISTS "Authenticated users can delete all applications" ON applications;
DROP POLICY IF EXISTS "Anyone can submit applications" ON applications;

-- Re-enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows INSERT for everyone
CREATE POLICY "Public can insert applications"
  ON applications
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users full access
CREATE POLICY "Authenticated full access"
  ON applications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
