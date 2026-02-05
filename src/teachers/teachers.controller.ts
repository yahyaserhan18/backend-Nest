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
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeacherListQueryDto } from './dto/teacher-list-query.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeachersService } from './teachers.service';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  /** GET /api/teachers?page=1&limit=20&search=... */
  @Get()
  list(@Query() query: TeacherListQueryDto) {
    return this.teachersService.findAll(query);
  }

  /** GET /api/teachers/:id/courses - teacher's courses (404 if teacher not found) */
  @Get(':id/courses')
  coursesByTeacherId(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.teachersService.getCoursesForTeacher(id);
  }

  @Get(':id')
  byId(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.teachersService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateTeacherDto) {
    return this.teachersService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateTeacherDto,
  ) {
    return this.teachersService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    await this.teachersService.remove(id);
    return { deleted: true };
  }
}
