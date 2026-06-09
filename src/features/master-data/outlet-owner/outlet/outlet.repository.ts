import { eq, ilike, and, SQL, ne } from 'drizzle-orm';
import { db } from '@/db/index';
import { OutletTable, OutletType, OutletInsertType, OutletFilter } from './outlet.model';
import { INACTIVE_STATUS } from '@/features/rbac/constants';

export class OutletRepositoryClass {
  async list(filter: OutletFilter = {}): Promise<OutletType[]> {
    const conditions: SQL[] = [];
    if (filter.outletName) conditions.push(ilike(OutletTable.outletName, `%${filter.outletName}%`));
    if (filter.status) conditions.push(eq(OutletTable.status, filter.status));
    if (filter.outletOwnerId) conditions.push(eq(OutletTable.outletOwnerId, filter.outletOwnerId));
    if (filter.outletEmail) conditions.push(ilike(OutletTable.outletEmail, `%${filter.outletEmail}%`));

    return db
      .select()
      .from(OutletTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(OutletTable.outletName);
  }

  async getById(id: string): Promise<OutletType | null> {
    const rows = await db.select().from(OutletTable).where(eq(OutletTable.id, id)).limit(1);
    return rows[0] ?? null;
  }

  async getByEmail(email: string, excludeId?: string): Promise<OutletType | null> {
    const conditions: SQL[] = [eq(OutletTable.outletEmail, email)];
    if (excludeId) conditions.push(ne(OutletTable.id, excludeId));

    const rows = await db
      .select()
      .from(OutletTable)
      .where(and(...conditions))
      .limit(1);
    return rows[0] ?? null;
  }

  async create(data: OutletInsertType): Promise<OutletType> {
    const [row] = await db.insert(OutletTable).values(data).returning();
    return row;
  }

  async update(id: string, data: Partial<OutletInsertType>): Promise<OutletType | null> {
    const [row] = await db
      .update(OutletTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(OutletTable.id, id))
      .returning();
    return row ?? null;
  }

  async deactivate(id: string, updatedBy: string): Promise<OutletType | null> {
    return this.update(id, { status: INACTIVE_STATUS, updatedBy });
  }
}
