import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.warn('Supabase environment variables not configured. Database features will not work.');
}

// Admin client with service key - use for server-side operations
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl || '',
  supabaseServiceKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Public client with anon key - use for client-side auth verification
export const supabasePublic: SupabaseClient = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Create a user-scoped client for RLS-protected queries
export const createUserClient = (accessToken: string): SupabaseClient => {
  return createClient(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    }
  );
};

export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  serviceKey: supabaseServiceKey
};
