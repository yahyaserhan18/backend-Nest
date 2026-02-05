/**
 * Student entity shape (used as DTO/response type).
 * Persistence is handled by Prisma; this type matches the students table.
 */
export class StudentEntity {
  id: string;
  name: string;
  age: number;
  grade: number;
  isActive: boolean;
  createdAt: Date;
}
