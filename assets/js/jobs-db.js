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

export async function uploadCV(file) {
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${timestamp}_${sanitizedFileName}`;

  const { data, error } = await supabase.storage
    .from('cv-uploads')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading CV:', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('cv-uploads')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function submitApplication(applicationData, cvFile) {
  let cvUrl = '';

  if (cvFile) {
    cvUrl = await uploadCV(cvFile);
  }

  const dataToInsert = {
    ...applicationData,
    cv_url: cvUrl
  };

  const { data, error } = await supabase
    .from('applications')
    .insert([dataToInsert])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error submitting application:', error);
    throw error;
  }

  return { application: data, cvUrl };
}

export async function sendApplicationEmail(emailData) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(`${supabaseUrl}/functions/v1/send-application-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`
    },
    body: JSON.stringify(emailData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email: ${errorText}`);
  }

  return await response.json();
}
