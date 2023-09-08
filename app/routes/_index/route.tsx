import type { V2_MetaFunction } from '@remix-run/cloudflare';
import { json, redirect } from '@remix-run/cloudflare';
import { Link, useActionData, useLoaderData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { useState } from 'react';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { z } from 'zod';

import { css } from '../../../styled-system/css';
import { grid } from '../../../styled-system/patterns';
import { Alert } from '../../components/Alert';
import { Field } from '../../components/Field';
import { VfButton } from '../../components/VfButton';
import { VfInput } from '../../components/VfInput';
import { PostLink } from '../../features/post/PostLink';
import { useProfile } from '../../root.context';
import type { Tables } from '../../utils/database-utils';
import { withSupabaseClient } from '../../utils/supabase-utils';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'ins' }, { name: 'description', content: '' }];
};

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
const signUpSchema = signInSchema.extend({
  username: z
    .string()
    .min(3)
    .regex(/^[a-z_-]+$/),
});
const signInValidator = withZod(signInSchema);
const signUpValidator = withZod(signUpSchema);

export const action = withSupabaseClient(
  async ({ client, response, request }) => {
    const formData = await request.formData();
    const intent = formData.get('intent');
    switch (intent) {
      case 'signin': {
        const result = await signInValidator.validate(formData);
        if (result.error) {
          return validationError(result.error, null, {
            headers: response.headers,
          });
        }
        const { data, error } = await client.auth.signInWithPassword({
          email: result.data.email,
          password: result.data.password,
        });
        if (error) {
          return json(
            {
              error: error.message,
            },
            {
              headers: response.headers,
              status: error.status,
            },
          );
        }
        const { data: profile, error: profileError } = await client
          .from('profiles')
          .select('username')
          .eq('id', data.user.id)
          .single();
        if (profileError) {
          return json(
            {
              error: profileError.message,
            },
            {
              headers: response.headers,
              status: 400,
            },
          );
        }
        return redirect(
          new URL(`/users/${profile.username}/`, request.url).toString(),
          {
            headers: response.headers,
          },
        );
      }

      case 'signup': {
        const result = await signUpValidator.validate(formData);
        if (result.error) {
          return validationError(result.error);
        }
        const { error } = await client.auth.signUp({
          email: result.data.email,
          password: result.data.password,
          options: {
            emailRedirectTo: new URL(
              `/users/${result.data.username}/`,
              request.url,
            ).toString(),
            data: {
              username: result.data.username,
            },
          },
        });
        if (error) {
          return json(
            {
              error: error.message,
            },
            {
              headers: response.headers,
              status: error.status,
            },
          );
        }
        return json(
          {
            message: 'Check your email for the confirmation link',
          },
          {
            headers: response.headers,
          },
        );
      }

      default: {
        console.log('hello');
        throw new Error(`Unknown intent: ${intent}`);
      }
    }
  },
);

export const loader = withSupabaseClient(async ({ response, client }) => {
  const { data: posts } = await client
    .from('posts')
    .select(
      `
        *,
        profile:profiles(*)
      `,
    )
    .returns<
      (Tables<'posts'> & {
        profile: Tables<'profiles'>;
      })[]
    >();
  return json({
    posts,
  });
});

export default function Index() {
  const profile = useProfile();
  const data = useActionData<typeof action>();
  const [intent, setIntent] = useState<'signin' | 'signup'>('signin');
  const isSignedIn = !!profile;
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div
      className={css({
        m: '0 auto',
        maxW: '960px',
        p: '0 20px',
      })}
    >
      <h1
        className={css({
          fontSize: {
            base: '24px',
            sm: '32px',
          },
          fontWeight: 'bold',
        })}
      >
        ins
      </h1>
      {isSignedIn ? (
        <>
          <p>hi {profile.username}.</p>
          <Link to={`/users/${profile.username}/`}>Go to your page</Link>
        </>
      ) : (
        <>
          {data && ('error' in data || 'message' in data) && (
            <Alert type={'error' in data ? 'error' : 'success'}>
              {'error' in data ? data.error : data.message}
            </Alert>
          )}
          <h2>{intent === 'signin' ? 'Sign in' : 'Sign up'}</h2>
          {intent === 'signin' ? <SignIn /> : <SignUp />}
          <button
            onClick={() => {
              setIntent((prev) => (prev === 'signin' ? 'signup' : 'signin'));
            }}
            className={css({
              textDecoration: 'underline',
            })}
          >
            {intent === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an acount? Sign in'}
          </button>
        </>
      )}
      <h2>Recent posts</h2>
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

function SignUp() {
  return (
    <ValidatedForm validator={signUpValidator} method="post">
      <Field label="Username" htmlFor="username">
        <VfInput name="username" id="username" type="text" />
      </Field>
      <Field label="Email" htmlFor="email">
        <VfInput name="email" id="email" type="email" />
      </Field>
      <Field label="Password" htmlFor="password">
        <VfInput name="password" id="password" type="password" />
      </Field>
      <VfButton
        className={css({ mt: '4px' })}
        type="submit"
        name="intent"
        value="signup"
      >
        sign up
      </VfButton>
    </ValidatedForm>
  );
}

function SignIn() {
  return (
    <ValidatedForm validator={signInValidator} method="post">
      <Field label="Email" htmlFor="email">
        <VfInput name="email" id="email" type="email" />
      </Field>
      <Field label="Password" htmlFor="password">
        <VfInput name="password" id="password" type="password" />
      </Field>
      <VfButton
        className={css({ mt: '4px' })}
        type="submit"
        name="intent"
        value="signin"
      >
        sign in
      </VfButton>
    </ValidatedForm>
  );
}
