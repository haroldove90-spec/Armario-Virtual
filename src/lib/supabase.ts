import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://aouvpbvjrsbtufhrmwaj.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdXZwYnZqcnNidHVmaHJtd2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0OTI3NTgsImV4cCI6MjEwMTA2ODc1OH0.Vhp1pHIGIbWyRxNgvHOSBGi98WlFbGqoMnGiNdeHbtU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_PROJECT_ID = 'aouvpbvjrsbtufhrmwaj';
export const SUPABASE_URL_ENDPOINT = 'https://aouvpbvjrsbtufhrmwaj.supabase.co/rest/v1/';

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      console.warn('Supabase database table check notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase offline or table pending creation:', err);
    return false;
  }
}
