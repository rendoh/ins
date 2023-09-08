import type { V2_MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';

import { css } from '../../styled-system/css';
import { getPostPublicUrl } from '../features/post/utils';
import { useBrowserClient } from '../root.context';
import type { Tables } from '../utils/database-utils';
import { withSupabaseClient } from '../utils/supabase-utils';

export const loader = withSupabaseClient(
  async ({ client, params, response }) => {
    const { data: post } = await client
      .from('posts')
      .select(
        `
          *,
          profile:profiles(*)
      `,
      )
      .eq('id', params.id ?? '')
      .single<
        Tables<'posts'> & {
          profile: Tables<'profiles'>;
        }
      >();

    console.log(JSON.stringify(post, null, 2));

    // .select(
    //   `
    //     *,
    //     profile:profiles(*)
    //   `,
    // )
    // .returns<
    //   (Tables<'posts'> & {
    //     profile: Tables<'profiles'>;
    //   })[]
    // >();

    if (!post) {
      throw new Response(null, {
        status: 404,
        statusText: 'Not Found',
        headers: response.headers,
      });
    }

    return json(
      {
        post,
      },
      {
        headers: response.headers,
      },
    );
  },
);

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.post.profile.username}'s post ${data?.post.id}` }];
};

export default function PostDetail() {
  const { post } = useLoaderData<typeof loader>();
  const client = useBrowserClient();
  return (
    <div>
      <div
        className={css({
          display: 'flex',
          flexDirection: {
            base: 'column',
            _landscape: 'row',
          },
          _landscape: {
            h: '100svh',
          },
        })}
      >
        <div
          className={css({
            _landscape: {
              flex: 1,
            },
          })}
        >
          <img
            className={css({
              display: 'block',
              w: '100%',
              h: '100%',
              objectFit: 'cover',
            })}
            src={getPostPublicUrl(client, post.object_path)}
            alt=""
          />
        </div>
        <div
          className={css({
            _landscape: {
              flex: 1,
            },
          })}
        >
          <p>
            Uploaded by{' '}
            <Link
              className={css({
                textDecoration: 'underline',
                fontWeight: 'bold',
              })}
              to={`/users/${post.profile.username}`}
            >
              {post.profile.username}
            </Link>
          </p>
          {post.description && <p>{post.description}</p>}
        </div>
      </div>
    </div>
  );
}
