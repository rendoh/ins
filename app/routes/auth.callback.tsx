import { redirect } from '@remix-run/cloudflare';

import { withSupabaseClient } from '../utils/supabase-utils';

// Code exchange route
export const loader = withSupabaseClient(
  async ({ request, response, context, client }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (code) {
      await client.auth.exchangeCodeForSession(code);
    }

    return redirect('/', {
      headers: response.headers,
    });
  },
);
