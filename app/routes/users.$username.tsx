import type { V2_MetaFunction } from '@remix-run/cloudflare';
import { json, redirect } from '@remix-run/cloudflare';
import { useActionData, useLoaderData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { z } from 'zod';

import { grid } from '../../styled-system/patterns';
import { Alert } from '../components/Alert';
import { Field } from '../components/Field';
import { VfButton } from '../components/VfButton';
import { VfInput } from '../components/VfInput';
import { VfTextarea } from '../components/VfTextarea';
import { PostLink } from '../features/post/PostLink';
import { useProfile } from '../root.context';
import { withSupabaseClient } from '../utils/supabase-utils';

export const loader = withSupabaseClient(
  async ({ client, params, response }) => {
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
  },
);

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.user.username}'s page` }];
};

const validator = withZod(
  z.object({
    file: z
      .instanceof(File)
      .refine(
        (file) => file.size < 1024 * 1024 * 1,
        'File size must be less than 1MB',
      )
      .refine(
        (file) => ['image/jpeg', 'image/png'].includes(file.type),
        'File must be a jpeg or png',
      ),
    description: z.string().max(512).optional(),
  }),
);

export const action = withSupabaseClient(
  async ({ client, request, response }) => {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) {
      return json(
        {
          error: 'Unauthorized',
        },
        {
          headers: response.headers,
          status: 403,
        },
      );
    }

    const formData = await request.formData();
    const result = await validator.validate(formData);
    if (result.error) {
      return validationError(result.error, null, {
        headers: response.headers,
      });
    }

    const random = Math.random().toString(36).slice(-8);
    const filePath = `${user?.id ?? 'anon'}/${random}.${result.data.file.name
      .split('.')
      .pop()}`;
    const { data, error: uploadError } = await client.storage
      .from('posts')
      .upload(filePath, result.data.file);

    if (uploadError) {
      return json(
        {
          error: uploadError.message,
        },
        {
          headers: response.headers,
          status: 400,
        },
      );
    }

    const { data: post, error } = await client
      .from('posts')
      .insert({
        description: result.data.description,
        user_id: user.id,
        object_path: data.path,
      })
      .select()
      .single();

    if (error) {
      return json(
        {
          error: error.message,
        },
        {
          headers: response.headers,
          status: 400,
        },
      );
    }

    return redirect(`/posts/${post.id}/`, {
      headers: response.headers,
    });
  },
);

export default function UserPosts() {
  const { user, posts } = useLoaderData<typeof loader>();
  const profile = useProfile();
  const data = useActionData<typeof action>();
  return (
    <div>
      <h1>{user.username}'s posts</h1>
      {profile && profile.id === user.id && (
        <>
          {data && 'error' in data && <Alert type="error">{data.error}</Alert>}
          <ValidatedForm
            validator={validator}
            method="post"
            encType="multipart/form-data"
          >
            <h2>Upload new photo</h2>
            <Field label="Photo" htmlFor="file">
              <VfInput type="file" name="file" id="file" />
            </Field>
            <Field label="Description" htmlFor="description">
              <VfTextarea name="description" id="description"></VfTextarea>
            </Field>
            <VfButton>upload</VfButton>
          </ValidatedForm>
        </>
      )}
      <div
        className={grid({
          columns: {
            base: 2,
            sm: 3,
            md: 4,
          },
          gap: '10px',
        })}
      >
        {posts?.map((post) => <PostLink key={post.id} post={post} />)}
      </div>
    </div>
  );
}
