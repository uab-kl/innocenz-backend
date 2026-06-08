import { AdminTable, AdminType, AdminInsertType } from '@/features/admin/admin.model.js';
import { db } from '@/db/index';
import { eq } from 'drizzle-orm';
import { JwtControllerClass } from '@/features/jwt/jwt.controller.js';
import { logger } from '@/util/logger.js';

export class AuthRepositoryClass {
  constructor(private jwtController: JwtControllerClass) {}

  async getUserDataByToken(token: string): Promise<AdminType | null> {
    try {
      const decodedToken = this.jwtController.verifyToken(token);
      if (!decodedToken.username) {
        return null;
      }
      return this.getAdminByEmail(decodedToken.username);
    } catch (error) {
      logger.error('[AuthRepository.getUserDataByToken] Error:', error);
      return null;
    }
  }

  async getAdminByEmail(email: string): Promise<AdminType | null> {
    const admins = await db.select().from(AdminTable).where(eq(AdminTable.email, email)).limit(1);
    return admins.length > 0 ? admins[0] : null;
  }

  async getAdminById(id: string): Promise<AdminType | null> {
    const admins = await db.select().from(AdminTable).where(eq(AdminTable.id, id)).limit(1);
    return admins.length > 0 ? admins[0] : null;
  }

  async createAdmin(data: AdminInsertType): Promise<AdminType> {
    const [admin] = await db.insert(AdminTable).values(data).returning();
    return admin;
  }
}
