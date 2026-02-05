import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

/**
 * Query for GET /api/teachers. Pagination + optional search (fullName or email).
 */
export class TeacherListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
