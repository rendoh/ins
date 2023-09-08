import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare';
import type { SupabaseClient } from '@supabase/auth-helpers-remix';
import { createServerClient } from '@supabase/auth-helpers-remix';

import type { Database } from '../../@types/schema';

// タプルの長さを取得する
type Length<T extends unknown[]> = T['length'];

// タプルの最初の要素を削除する
type Pop<T extends unknown[]> = Length<T> extends 0
  ? []
  : ((...b: T) => void) extends (a: unknown, ...b: infer I) => void
  ? I
  : [];

/**
 * LoaderFunction / ActionFunction の引数を拡張する
 * NOTE: 現状、LoaderFunction / ActionFunctio は引数が1つのみだが、
 * 今後、引数が増える可能性を考慮して可変長引数としている
 */
type Args<T extends LoaderFunction | ActionFunction> = Parameters<T>;
type ExpandedArgs<T extends LoaderFunction | ActionFunction> = [
  Args<T>[0] & { client: SupabaseClient<Database>; response: Response },
  ...Pop<Args<T>>,
];

/**
 * LoaderFunction / ActionFunction に Supabase client を注入するためのユーティリティ
 */
export function withSupabaseClient<T>(
  fn: (...args: ExpandedArgs<LoaderFunction | ActionFunction>) => T,
) {
  return (async (dataFunctionArgs, ...rest) => {
    const response = new Response();
    const { context, request } = dataFunctionArgs;
    const client = createServerClient<Database>(
      context.env.SUPABASE_URL,
      context.env.SUPABASE_ANON_KEY,
      {
        request,
        response,
      },
    );
    return await fn(
      ...[
        {
          ...dataFunctionArgs,
          client,
          response,
        },
        ...rest,
      ],
    );
  }) satisfies LoaderFunction | ActionFunction;
}
