import { Role } from '@prisma/client';

/**
 * Payload attached to the request after JWT validation (req.user).
 */
export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
  teacherId?: string | null;
  studentId?: string | null;
  iat?: number;
  exp?: number;
};
