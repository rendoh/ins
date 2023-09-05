import type { LoaderFunction } from '@remix-run/cloudflare';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// タプルの長さを取得する
type Length<T extends unknown[]> = T['length'];

// タプルの最初の要素を削除する
type Pop<T extends unknown[]> = Length<T> extends 0
  ? []
  : ((...b: T) => void) extends (a: unknown, ...b: infer I) => void
  ? I
  : [];

/**
 * LoaderFunctionの引数を拡張する
 * NOTE: 現状、LoaderFunctionは引数が1つのみだが、
 * 今後、引数が増える可能性を考慮して可変長引数としている
 */
type Args = Parameters<LoaderFunction>;
type ExpandedArgs = [
  Args[0] & { db: ReturnType<typeof drizzle> },
  ...Pop<Args>,
];

/**
 * LoaderFunction に drizzle を注入するためのユーティリティ
 */
export function createLoaderWithDb<T>(loader: (...args: ExpandedArgs) => T) {
  return (async (dataFunctionArgs, ...rest) => {
    const pool = new Pool({
      connectionString: dataFunctionArgs.context.env.DATABASE_URL,
    });
    const db = drizzle(pool);
    const result = await loader(
      ...[
        {
          ...dataFunctionArgs,
          db,
        },
        ...rest,
      ],
    );
    await pool.end();
    return result;
  }) satisfies LoaderFunction;
}
