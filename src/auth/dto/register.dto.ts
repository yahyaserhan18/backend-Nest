import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsEnum(Role)
  role: Role;

  /** Required when role is TEACHER */
  @ValidateIf((o) => o.role === Role.TEACHER)
  @IsString()
  @MinLength(2)
  fullName?: string;

  /** Required when role is STUDENT */
  @ValidateIf((o) => o.role === Role.STUDENT)
  @IsString()
  @MinLength(2)
  name?: string;

  @ValidateIf((o) => o.role === Role.STUDENT)
  @IsInt()
  @Min(6)
  @Max(80)
  age?: number;

  @ValidateIf((o) => o.role === Role.STUDENT)
  @IsInt()
  @Min(0)
  @Max(100)
  grade?: number;
}
