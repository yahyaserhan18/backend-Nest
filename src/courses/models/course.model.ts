/**
 * Domain model for a course (non-ORM).
 */
export type CourseModel = {
  id: string;
  title: string;
  code: string;
  createdAt: Date;
  teacherId: string;
};
