import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://vgodirmbwvzgilxlgfjt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnb2Rpcm1id3Z6Z2lseGxnZmp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMDAxNzUsImV4cCI6MjA4Njc3NjE3NX0.QI6POK4qKXqhv89zQ-I9FAtC4SygiStNISQQLhPkl8g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
