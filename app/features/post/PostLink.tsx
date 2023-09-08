import { Link } from '@remix-run/react';

import { css } from '../../../styled-system/css';
import { useBrowserClient } from '../../root.context';
import type { Tables } from '../../utils/database-utils';
import { getPostPublicUrl } from './utils';

type PostLinkProps = {
  post: Tables<'posts'> & {
    profile?: Tables<'profiles'>;
  };
};

export function PostLink({ post }: PostLinkProps) {
  const client = useBrowserClient();
  return (
    <div>
      <Link
        className={css({
          aspectRatio: '1 / 1',
          display: 'block',
        })}
        to={`/posts/${post.id}`}
      >
        <img
          className={css({
            objectFit: 'cover',
            w: '100%',
            h: '100%',
          })}
          src={getPostPublicUrl(client, post.object_path)}
          alt=""
        />
      </Link>
      {post.profile && (
        <p
          className={css({
            mt: '4px',
            display: 'block',
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
        </p>
      )}
    </div>
  );
}
