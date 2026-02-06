/**
 * Domain model for a teacher (non-ORM).
 */
export type TeacherModel = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  createdAt: Date;
};
