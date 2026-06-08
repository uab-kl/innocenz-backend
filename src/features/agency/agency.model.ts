import { timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { MainSchema } from '@/db/db.schema';

export const AgencyTable = MainSchema.table('agency', {
    id: uuid('id').defaultRandom().notNull().primaryKey(),
    agencyName: varchar('agency_name', { length: 100 }).notNull(),
    agencyAddress: varchar('agency_address', { length: 255 }).notNull(),
    agencyContactNo: varchar('agency_contact_no', { length: 20 }).notNull(),
    agencyEmail: varchar('agency_email', { length: 100 }).notNull(),
    agencyLogo: varchar('agency_logo', { length: 255 }).notNull(),
    status: varchar('agency_status', { length: 20 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: varchar('created_by').notNull(),
    updatedBy: varchar('updated_by').notNull(),
});