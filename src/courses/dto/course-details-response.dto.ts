import { TeacherResponseDto } from '../../teachers/dto/teacher-response.dto';

/**
 * GET /api/courses/:id response: course + teacher + studentsCount.
 */
export type CourseDetailsResponseDto = {
  id: string;
  title: string;
  code: string;
  createdAt: string;
  teacher: TeacherResponseDto;
  studentsCount: number;
};
