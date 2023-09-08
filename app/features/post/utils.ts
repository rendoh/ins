import type { SupabaseClient } from '@supabase/auth-helpers-remix';

export function getPostPublicUrl(supabase: SupabaseClient, objectPath: string) {
  const {
    data: { publicUrl },
  } = supabase.storage.from('posts').getPublicUrl(objectPath);
  return publicUrl;
}
