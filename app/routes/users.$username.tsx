import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';

import type { Database } from '../../@types/schema';
import { useBrowserClient } from '../root.context';

export const loader = (async ({ context, request, params }) => {
  const response = new Response();
  const client = createServerClient<Database>(
    context.env.SUPABASE_URL,
    context.env.SUPABASE_ANON_KEY,
    {
      request,
      response,
    },
  );
  const { data: user } = await client
    .from('profiles')
    .select('id, username')
    .eq('username', params.username ?? '')
    .single();

  if (!user) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
      headers: response.headers,
    });
  }

  const { data: posts } = await client
    .from('posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: false,
    });

  return json(
    {
      user,
      posts,
    },
    {
      headers: response.headers,
    },
  );
}) satisfies LoaderFunction;

export default function UserPosts() {
  const { user, posts } = useLoaderData<typeof loader>();
  const client = useBrowserClient();
  return (
    <div>
      <h1>{user.username}'s posts</h1>
      <div>
        {posts?.map((post) => (
          <div key={post.id}>
            <img
              src={(() => {
                const {
                  data: { publicUrl },
                } = client.storage.from('posts').getPublicUrl(post.object_path);
                return publicUrl;
              })()}
              alt=""
            />
            <p>{post.description} </p>
          </div>
        ))}
      </div>
    </div>
  );
}
