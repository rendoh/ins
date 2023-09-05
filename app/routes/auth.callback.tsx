import type { LoaderFunction } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { createServerClient } from '@supabase/auth-helpers-remix';

import type { Database } from '../../@types/schema';

// Code exchange route
export const loader = (async ({ request, context }) => {
  // TODO: remove this
  console.log('auth.callback.tsx');
  const response = new Response();
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (code) {
    const supabaseClient = createServerClient<Database>(
      context.env.SUPABASE_URL,
      context.env.SUPABASE_ANON_KEY,
      { request, response },
    );
    await supabaseClient.auth.exchangeCodeForSession(code);
  }

  return redirect('/', {
    headers: response.headers,
  });
}) satisfies LoaderFunction;
