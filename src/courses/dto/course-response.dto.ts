/**
 * Minimal API response shape for a course. createdAt is ISO 8601 string.
 */
export type CourseResponseDto = {
  id: string;
  title: string;
  code: string;
  createdAt: string;
};
