/* eslint-disable @typescript-eslint/no-var-requires */

const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { Pool } = require('pg');
require('dotenv').config();

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(pool, {
    logger: true,
  });
  try {
    await migrate(db, {
      migrationsFolder: './app/db/migrations',
    });
    console.log('Migration complete');
  } catch (error) {
    console.log(error);
  } finally {
    await pool.end();
  }
}

main();
