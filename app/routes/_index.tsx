import {
  json,
  type LoaderFunction,
  type V2_MetaFunction,
} from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { useEffect } from 'react';

import type { Database } from '../../@types/schema';

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
    console.log(posts);
  }, [posts]);
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
