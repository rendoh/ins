import '@remix-run/cloudflare';

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    env: Record<string, unknown> & {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
    };
  }
}
