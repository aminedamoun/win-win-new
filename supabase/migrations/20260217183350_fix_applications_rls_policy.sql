/*
  # Fix Applications RLS Policy

  1. Changes
    - Drop existing INSERT policy
    - Recreate INSERT policy to allow anonymous submissions
    - Ensure policy allows all fields to be inserted
  
  2. Security
    - Allow public (anonymous) users to insert applications
    - No restrictions on data being inserted
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can submit applications" ON applications;

-- Create new policy that explicitly allows all inserts
CREATE POLICY "Anyone can submit applications"
  ON applications
  FOR INSERT
  TO public
  WITH CHECK (true);
