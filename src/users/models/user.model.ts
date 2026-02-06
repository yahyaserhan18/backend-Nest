import { Role } from '@prisma/client';

/**
 * Domain model for a user (identity). Used by the repository and auth layers.
 */
export type UserModel = {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  isActive: boolean;
  refreshTokenHash: string | null;
  createdAt: Date;
  updatedAt: Date;
  teacherId?: string | null;
  studentId?: string | null;
};
