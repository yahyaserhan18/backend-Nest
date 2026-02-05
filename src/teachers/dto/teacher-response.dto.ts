/**
 * API response shape for a teacher. createdAt is ISO 8601 string.
 */
export type TeacherResponseDto = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
};
