import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsInt()
  @Min(6)
  @Max(80)
  age: number;

  @IsInt()
  @Min(0)
  @Max(100)
  grade: number;

  @IsBoolean()
  isActive: boolean;
}
