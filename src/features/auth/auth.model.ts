import type { AdminType, AdminInsertType } from '@/features/admin/admin.model';

export type UserType = AdminType;
export type UserInsertType = AdminInsertType;

export type UserLoginDto = {
  email: string;
  password: string;
};
