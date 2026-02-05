/**
 * Domain model for a teacher (non-ORM).
 */
export type TeacherModel = {
  id: string;
  fullName: string;
  email: string;
  createdAt: Date;
};
