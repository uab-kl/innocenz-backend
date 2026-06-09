import { eq, ilike, and, SQL } from 'drizzle-orm';
import { db } from '@/db/index';
import { AgencyTable, AgencyType, AgencyInsertType, AgencyFilter } from './agency.model';
import { INACTIVE_STATUS } from '@/features/rbac/constants';

export class AgencyRepositoryClass {
  async list(filter: AgencyFilter = {}): Promise<AgencyType[]> {
    const conditions: SQL[] = [];
    if (filter.agencyName) conditions.push(ilike(AgencyTable.agencyName, `%${filter.agencyName}%`));
    if (filter.status) conditions.push(eq(AgencyTable.status, filter.status));
    if (filter.agencyEmail) conditions.push(ilike(AgencyTable.agencyEmail, `%${filter.agencyEmail}%`));

    return db
      .select()
      .from(AgencyTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(AgencyTable.agencyName);
  }

  async getById(id: string): Promise<AgencyType | null> {
    const rows = await db.select().from(AgencyTable).where(eq(AgencyTable.id, id)).limit(1);
    return rows[0] ?? null;
  }

  async getByEmail(email: string): Promise<AgencyType | null> {
    const rows = await db.select().from(AgencyTable).where(eq(AgencyTable.agencyEmail, email)).limit(1);
    return rows[0] ?? null;
  }

  async create(data: AgencyInsertType): Promise<AgencyType> {
    const [row] = await db.insert(AgencyTable).values(data).returning();
    return row;
  }

  async update(id: string, data: Partial<AgencyInsertType>): Promise<AgencyType | null> {
    const [row] = await db
      .update(AgencyTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(AgencyTable.id, id))
      .returning();
    return row ?? null;
  }

  async deactivate(id: string, updatedBy: string): Promise<AgencyType | null> {
    return this.update(id, { status: INACTIVE_STATUS, updatedBy });
  }
}
