import { config } from 'dotenv';
import pg from 'pg';

config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();

try {
  const schemas = await client.query(
    "SELECT schema_name FROM information_schema.schemata WHERE schema_name IN ('main', 'drizzle') ORDER BY schema_name",
  );
  console.log('schemas:', schemas.rows);

  const tables = await client.query(
    "SELECT schemaname, tablename FROM pg_tables WHERE schemaname IN ('main', 'drizzle') ORDER BY schemaname, tablename",
  );
  console.log('tables:', tables.rows);

  try {
    const migrations = await client.query(
      'SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY created_at',
    );
    console.log('applied migrations:', migrations.rows);
  } catch (error) {
    console.log('drizzle migrations table:', error.message);
  }
} finally {
  client.release();
  await pool.end();
}
