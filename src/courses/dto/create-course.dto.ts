import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @MinLength(2)
  code: string;

  /** Ignored when creating as authenticated teacher (uses current user's teacherId). */
  @IsOptional()
  @IsUUID('4')
  teacherId?: string;
}
