import type { ActionFunction, V2_MetaFunction } from '@remix-run/cloudflare';
import { json, redirect } from '@remix-run/cloudflare';
import { Form } from '@remix-run/react';
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
  } = await client.auth.getUser();
  if (!user) {
    return json(
      {
        error: 'no-user',
      },
      {
        headers: response.headers,
        status: 400,
      },
    );
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return json(
      {
        error: 'no-file',
      },
      {
        headers: response.headers,
        status: 400,
      },
    );
  }
  const random = Math.random().toString(36).slice(-8);
  const filePath = `${user?.id ?? 'anon'}/${random}.${file.name
    .split('.')
    .pop()}`;
  const { data } = await client.storage.from('posts').upload(filePath, file);

  if (!data) {
    return json(
      {
        error: 'no-data',
      },
      {
        headers: response.headers,
        status: 400,
      },
    );
  }

  const description = (() => {
    const value = formData.get('description');
    if (typeof value === 'string') {
      return value;
    }
    return null;
  })();

  const { error } = await client.from('posts').insert({
    description,
    user_id: user.id,
    object_path: data.path,
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

  const { data: profile } = await client
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  return redirect(`/users/${profile?.username}`);
}) satisfies ActionFunction;

export default function Index() {
  const supabase = useBrowserClient();
  const profile = useProfile();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>ins</h1>
      <Form method="post" encType="multipart/form-data">
        <input type="file" name="file" />
        <textarea name="description"></textarea>
        <button type="submit">upload</button>
      </Form>
      {!profile && <AuthForm supabase={supabase} />}
    </div>
  );
}

function AuthForm({ supabase }: { supabase: SupabaseClient }) {
  const [username, setUsername] = useState('');
  return (
    <div>
      <label htmlFor="username">username</label>
      <input
        id="username"
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
