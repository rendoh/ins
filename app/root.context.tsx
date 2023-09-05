import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import {
  Outlet,
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from '@remix-run/react';
import type { User } from '@supabase/auth-helpers-remix';
import {
  createBrowserClient,
  createServerClient,
} from '@supabase/auth-helpers-remix';
import { useEffect, useState } from 'react';

import type { Database } from '../@types/schema';

/**
 * root コンポーネントでのBrowserClientやセッション管理
 * FYI: https://supabase.com/docs/guides/auth/auth-helpers/remix
 */

export const rootLoader = (async ({ request, context }) => {
  const env = {
    SUPABASE_URL: context.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: context.env.SUPABASE_ANON_KEY,
  };
  const response = new Response();
  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    request,
    response,
  });
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  const [
    {
      data: { session },
    },
    {
      data: { user },
    },
  ] = await Promise.all([supabase.auth.getSession(), supabase.auth.getUser()]);

  return json(
    { env, session, user },
    {
      headers: response.headers,
    },
  );
}) satisfies LoaderFunction;

function useSupabase(url: string, anonKey: string) {
  const [supabase] = useState(() =>
    createBrowserClient<Database>(url, anonKey),
  );
  return supabase;
}

export function RootOutlet() {
  const { env, session, user } = useLoaderData<typeof rootLoader>();
  const supabase = useSupabase(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  const { revalidate } = useRevalidator();
  const serverAccessToken = session?.access_token;
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event !== 'INITIAL_SESSION' &&
        session?.access_token !== serverAccessToken
      ) {
        revalidate();
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [revalidate, serverAccessToken, supabase.auth]);

  return <Outlet context={{ supabase, user } satisfies ContextType} />;
}

type ContextType = {
  supabase: ReturnType<typeof useSupabase>;
  user: User | null;
};

export function useBrowserClient() {
  return useOutletContext<ContextType>().supabase;
}

export function useUser() {
  return useOutletContext<ContextType>().user;
}
