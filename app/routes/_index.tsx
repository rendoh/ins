import {
  json,
  type LoaderFunction,
  type V2_MetaFunction,
} from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect } from 'react';

import type { Database } from '../../@types/schema';
import { useBrowserClient, useUser } from '../root.context';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const loader = (async ({ context, request }) => {
  const response = new Response();
  const client = createServerClient<Database>(
    context.env.SUPABASE_URL,
    context.env.SUPABASE_ANON_KEY,
    {
      request,
      response,
    },
  );

  const { data, error } = await client.from('posts').select('*');
  if (error) {
    return json(
      {},
      {
        headers: response.headers,
        status: 400,
      },
    );
  }
  return json(
    {
      data,
    },
    {
      headers: response.headers,
    },
  );
}) satisfies LoaderFunction;

export default function Index() {
  const posts = useLoaderData<typeof loader>();
  useEffect(() => {
    // console.log(posts);
  }, [posts]);
  const supabase = useBrowserClient();
  const user = useUser();
  // useEffect(() => {
  //   supabase.auth.getUser().then((user) => {
  //     console.log(user);
  //   });
  // }, [supabase.auth]);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>Welcome to Remix</h1>
      {user && <h2>Hello, {user.id}</h2>}
      {!user && (
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      )}
    </div>
  );
}
