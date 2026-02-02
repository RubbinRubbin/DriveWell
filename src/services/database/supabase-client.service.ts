import { supabaseAdmin, supabasePublic, createUserClient } from '../../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseClientService {
  private static instance: SupabaseClientService;

  private constructor() {}

  public static getInstance(): SupabaseClientService {
    if (!SupabaseClientService.instance) {
      SupabaseClientService.instance = new SupabaseClientService();
    }
    return SupabaseClientService.instance;
  }

  // Get admin client for server operations (bypasses RLS)
  public getAdminClient(): SupabaseClient {
    return supabaseAdmin;
  }

  // Get public client for auth operations
  public getPublicClient(): SupabaseClient {
    return supabasePublic;
  }

  // Get user-scoped client for RLS-protected operations
  public getUserClient(accessToken: string): SupabaseClient {
    return createUserClient(accessToken);
  }

  // Test connection to Supabase
  public async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin.from('customers').select('count').limit(1);
      if (error && error.code !== 'PGRST116') {
        console.error('Supabase connection test failed:', error.message);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Supabase connection test error:', error);
      return false;
    }
  }
}

export const supabaseClientService = SupabaseClientService.getInstance();
