import { TeacherResponseDto } from '../dto/teacher-response.dto';
import { TeacherModel } from '../models/teacher.model';

export function toTeacherResponseDto(model: TeacherModel): TeacherResponseDto {
  return {
    id: model.id,
    fullName: model.fullName,
    email: model.email,
    createdAt: model.createdAt.toISOString(),
  };
}
