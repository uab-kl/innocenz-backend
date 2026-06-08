import 'dotenv/config';
import { fileURLToPath } from 'node:url';

import { eq } from 'drizzle-orm';
import { db } from '@/db/index';
import { AdminTable } from '@/features/admin/admin.model';
import { hashPassword } from '@/util/password';
import { logger } from '@/util/logger';

const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL;
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD;
const DEFAULT_ADMIN_NAME = process.env.DEFAULT_ADMIN_NAME ?? 'System Admin';

export async function initAdmin(): Promise<void> {
  if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) {
    logger.warn(
      'Skipping default admin seed (set DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD in .env)',
    );
    return;
  }

  const existing = await db
    .select({ id: AdminTable.id })
    .from(AdminTable)
    .where(eq(AdminTable.email, DEFAULT_ADMIN_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    logger.info(`Default admin already exists: ${DEFAULT_ADMIN_EMAIL}`);
    return;
  }

  const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);

  await db.insert(AdminTable).values({
    email: DEFAULT_ADMIN_EMAIL,
    displayName: DEFAULT_ADMIN_NAME,
    password: passwordHash,
    status: 'active',
    createdBy: 'system',
    updatedBy: 'system',
  });

  logger.info(`Default admin created: ${DEFAULT_ADMIN_EMAIL}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initAdmin()
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('Failed to seed default admin', error);
      process.exit(1);
    });
}
