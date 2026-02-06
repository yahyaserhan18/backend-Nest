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
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { CourseListQueryDto } from './dto/course-list-query.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CoursesService } from './courses.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/auth.types';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CourseOwnerGuard } from './guards/course-owner.guard';

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
  @UseGuards(RolesGuard)
  @Roles(Role.TEACHER)
  create(
    @Body() dto: CreateCourseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.create(dto, user.teacherId!);
  }

  @Patch(':id')
  @UseGuards(RolesGuard, CourseOwnerGuard)
  @Roles(Role.TEACHER)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard, CourseOwnerGuard)
  @Roles(Role.TEACHER)
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    await this.coursesService.remove(id);
    return { deleted: true };
  }

  /** POST /api/courses/:id/students/:studentId - idempotent enroll (teacher owner only) */
  @Post(':id/students/:studentId')
  @UseGuards(RolesGuard, CourseOwnerGuard)
  @Roles(Role.TEACHER)
  async enrollStudent(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
  ) {
    await this.coursesService.enrollStudent(id, studentId);
    return { enrolled: true };
  }

  /** DELETE /api/courses/:id/students/:studentId - idempotent unenroll (teacher owner only) */
  @Delete(':id/students/:studentId')
  @UseGuards(RolesGuard, CourseOwnerGuard)
  @Roles(Role.TEACHER)
  async unenrollStudent(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
  ) {
    await this.coursesService.unenrollStudent(id, studentId);
    return { unenrolled: true };
  }
}
