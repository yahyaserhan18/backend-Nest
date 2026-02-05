import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { CourseListQueryDto } from './dto/course-list-query.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /** GET /api/courses?page=1&limit=20&search=...&teacherId=... */
  @Get()
  list(@Query() query: CourseListQueryDto) {
    return this.coursesService.findAll(query);
  }

  /** GET /api/courses/:id - returns course with teacher and studentsCount */
  @Get(':id')
  byId(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.coursesService.findByIdWithDetails(id);
  }

  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    await this.coursesService.remove(id);
    return { deleted: true };
  }

  /** POST /api/courses/:id/students/:studentId - idempotent enroll */
  @Post(':id/students/:studentId')
  async enrollStudent(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
  ) {
    await this.coursesService.enrollStudent(id, studentId);
    return { enrolled: true };
  }

  /** DELETE /api/courses/:id/students/:studentId - idempotent unenroll */
  @Delete(':id/students/:studentId')
  async unenrollStudent(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
  ) {
    await this.coursesService.unenrollStudent(id, studentId);
    return { unenrolled: true };
  }
}
