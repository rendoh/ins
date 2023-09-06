import type { Database } from '../../@types/schema';

/**
 * FYI: https://supabase.com/docs/reference/javascript/typescript-support
 */

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];
