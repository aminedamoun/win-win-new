import { supabase } from './supabase-client.js';

export async function getAllJobs() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  return data || [];
}

export async function getJobBySlug(slug) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching job:', error);
    return null;
  }

  return data;
}

export async function submitApplication(applicationData) {
  const { data, error } = await supabase
    .from('applications')
    .insert([applicationData])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error submitting application:', error);
    throw error;
  }

  return data;
}
