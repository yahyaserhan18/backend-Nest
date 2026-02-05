import { TeacherResponseDto } from '../../teachers/dto/teacher-response.dto';
import { toTeacherResponseDto } from '../../teachers/mappers/teacher.mapper';
import { CourseDetailsResponseDto } from '../dto/course-details-response.dto';
import { CourseResponseDto } from '../dto/course-response.dto';
import { CourseModel } from '../models/course.model';

export function toCourseResponseDto(model: CourseModel): CourseResponseDto {
  return {
    id: model.id,
    title: model.title,
    code: model.code,
    createdAt: model.createdAt.toISOString(),
  };
}

export function toCourseDetailsResponseDto(
  course: CourseModel,
  teacher: TeacherResponseDto,
  studentsCount: number,
): CourseDetailsResponseDto {
  return {
    id: course.id,
    title: course.title,
    code: course.code,
    createdAt: course.createdAt.toISOString(),
    teacher,
    studentsCount,
  };
}
