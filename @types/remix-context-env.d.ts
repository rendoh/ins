import '@remix-run/cloudflare';

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    env: Record<string, unknown> & {
      DATABASE_URL: string;
    };
  }
}
