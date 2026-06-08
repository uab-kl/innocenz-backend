import { timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { MainSchema } from '@/db/db.schema';
import { OutletOwnerTable } from '../outlet-owner.model';

export const OutletTable = MainSchema.table('outlet', {
    id: uuid('id').defaultRandom().notNull().primaryKey(),
    outletOwnerId: uuid('outlet_owner_id').references(() => OutletOwnerTable.id).notNull(),
    outletName: varchar('outlet_name', { length: 100 }).notNull(),
    outletAddress: varchar('outlet_address', { length: 255 }).notNull(),
    outletContactNo: varchar('outlet_contact_no', { length: 20 }).notNull(),
    outletEmail: varchar('outlet_email', { length: 100 }).notNull(),
    outletLogo: varchar('outlet_logo', { length: 255 }).notNull(),
    status: varchar('status', { length: 20 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: varchar('created_by').notNull(),
    updatedBy: varchar('updated_by').notNull(),
});