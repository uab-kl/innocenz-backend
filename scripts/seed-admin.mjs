import { config } from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcrypt';

config();

const email = process.argv[2] ?? 'admin@test.com';
const password = process.argv[3] ?? 'password123';
const displayName = process.argv[4] ?? 'Test Admin';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();

try {
  const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

  const result = await client.query(
    `INSERT INTO main.admin (email, display_name, password_hash, status, created_by, updated_by)
     VALUES ($1, $2, $3, 'active', 'seed', 'seed')
     ON CONFLICT (email) DO NOTHING
     RETURNING id, email, display_name, status`,
    [email, displayName, passwordHash],
  );

  if (result.rowCount === 0) {
    console.log(`Admin already exists: ${email}`);
  } else {
    console.log('Test admin created:', result.rows[0]);
    console.log(`Login with email=${email} password=${password}`);
  }
} finally {
  client.release();
  await pool.end();
}
