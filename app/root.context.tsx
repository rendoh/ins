import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import {
  Outlet,
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from '@remix-run/react';
import {
  createBrowserClient,
  createServerClient,
} from '@supabase/auth-helpers-remix';
import { useEffect, useState } from 'react';

import type { Database } from '../@types/schema';
import type { Tables } from './utils/database-utils';

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
  const supabase = createServerClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      request,
      response,
    },
  );
  const [
    {
      data: { session },
    },
    {
      data: { user },
    },
  ] = await Promise.all([supabase.auth.getSession(), supabase.auth.getUser()]);

  const profile = user
    ? await (async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        return error ? null : data;
      })()
    : null;

  return json(
    { env, session, profile },
    {
      headers: response.headers,
    },
  );
}) satisfies LoaderFunction;

function useSupabase(url: string, anonKey: string) {
  const [supabase] = useState(() => {
    return createBrowserClient<Database>(url, anonKey);
  });
  return supabase;
}

export function RootOutlet() {
  const { env, session, profile } = useLoaderData<typeof rootLoader>();
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

  return <Outlet context={{ supabase, profile } satisfies ContextType} />;
}

type ContextType = {
  supabase: ReturnType<typeof useSupabase>;
  profile: Tables<'profiles'> | null;
};

export function useBrowserClient() {
  return useOutletContext<ContextType>().supabase;
}

export function useProfile() {
  return useOutletContext<ContextType>().profile;
}
