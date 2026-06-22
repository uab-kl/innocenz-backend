import { db } from '@/db/index';
import { eq, inArray, and } from 'drizzle-orm';
import { JwtControllerClass } from '@/features/jwt/jwt.controller.js';
import { logger } from '@/util/logger.js';
import { UserTable, UserType } from '@/features/user/user.model.js';
import { UserRoleTable } from '@/features/rbac/user-role/user-role.model.js';
import { RoleTable } from '@/features/rbac/role/role.model.js';

export class AuthRepositoryClass {
  constructor(private jwtController: JwtControllerClass) { }

  async getUserByLoginMethod(method: 'email' | 'phone', value: string): Promise<UserType | null> {
    try {
      logger.info('[AuthRepository.getUserByLoginMethod] Getting user by login method:', method);
      let users: UserType[] = [];

      if (method === 'email') {
        logger.debug('[AuthRepository.getUserByLoginMethod] Getting user by email:', value);
        users = await db.select().from(UserTable).where(eq(UserTable.email, value)).limit(1);
      } else if (method === 'phone') {
        logger.debug('[AuthRepository.getUserByLoginMethod] Getting user by phone:', value);
        users = await db.select().from(UserTable).where(eq(UserTable.phoneNum, value)).limit(1);
      }
      logger.info('[AuthRepository.getUserByLoginMethod] Users:', users);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      logger.error('[AuthRepository.getUserByLoginMethod] Error:', error);
      return null;
    }
  }

  async getUserById(id: string): Promise<UserType | null> {
    try {
      const users = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.id, id))
        .limit(1);

      return users.length > 0 ? users[0] : null;
    } catch (error) {
      logger.error('[AuthRepository.getUserById] Error:', error);
      return null;
    }
  }

  async getUsersByIds(ids: string[]): Promise<UserType[]> {
    if (ids.length === 0) return [];
    try {
      const users = await db
        .select()
        .from(UserTable)
        .where(inArray(UserTable.id, ids));
      return users;
    } catch (error) {
      logger.error('[AuthRepository.getUsersByIds] Error:', error);
      return [];
    }
  }

  async getUserIdsByRoleId(roleId: string): Promise<string[]> {
    try {
      const rows = await db
        .select({ userId: UserRoleTable.userId })
        .from(UserRoleTable)
        .where(and(eq(UserRoleTable.roleId, roleId)));
      return rows.map((r) => r.userId);
    } catch (error) {
      logger.error('[AuthRepository.getUserIdsByRoleId] Error:', error);
      return [];
    }
  }

  async getRolesForUserIds(userIds: string[]): Promise<Array<{ userId: string; roleId: string; roleName: string }>> {
    if (userIds.length === 0) return [];
    try {
      const results = await db
        .select({
          userId: UserRoleTable.userId,
          roleId: RoleTable.id,
          roleName: RoleTable.roleName,
        })
        .from(UserRoleTable)
        .innerJoin(RoleTable, eq(UserRoleTable.roleId, RoleTable.id))
        .where(and(inArray(UserRoleTable.userId, userIds)));
      return results;
    } catch (error) {
      logger.error('[AuthRepository.getRolesForUserIds] Error:', error);
      return [];
    }
  }

  
}
