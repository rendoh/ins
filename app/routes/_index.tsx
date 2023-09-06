import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction,
} from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Form, useLoaderData } from '@remix-run/react';
import type { SupabaseClient } from '@supabase/auth-helpers-remix';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useState } from 'react';

import type { Database } from '../../@types/schema';
import { useBrowserClient, useProfile } from '../root.context';

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

  const { data: posts, error } = await client
    .from('posts')
    .select('*')
    .order('created_at', {
      ascending: false,
    });
  if (error) {
    return json(
      { error },
      {
        headers: response.headers,
        status: 400,
      },
    );
  }
  return json(
    {
      posts,
    },
    {
      headers: response.headers,
    },
  );
}) satisfies LoaderFunction;

export const action = (async ({ context, request }) => {
  const response = new Response();
  const client = createServerClient<Database>(
    context.env.SUPABASE_URL,
    context.env.SUPABASE_ANON_KEY,
    {
      request,
      response,
    },
  );
  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();
  const { error } = await client.from('posts').insert({
    description: Math.random().toString(36).slice(-8),
    user_id: user?.id,
  });

  if (error) {
    return json(
      {
        error,
      },
      {
        headers: response.headers,
        status: 400,
      },
    );
  }

  return json(null, {
    headers: response.headers,
    status: 201,
  });
}) satisfies ActionFunction;

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const supabase = useBrowserClient();
  const profile = useProfile();
  const posts = 'posts' in loaderData ? loaderData.posts : [];

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>Welcome to Remix</h1>
      {profile && <h2>Hello, {profile.username}</h2>}
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.description ?? 'no-description'}</p>
        </div>
      ))}
      {profile && (
        <Form method="post">
          <button type="submit">generate random post</button>
        </Form>
      )}
      {!profile && <AuthForm supabase={supabase} />}
    </div>
  );
}

function AuthForm({ supabase }: { supabase: SupabaseClient }) {
  const [username, setUsername] = useState('');
  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        additionalData={{
          username,
        }}
      />
    </div>
  );
}
