import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get() // GET /api/students
  all() {
    return this.studentsService.findAll();
  }

  @Get('passed') // GET /api/students/passed?minGrade=60
  passed(@Query('minGrade') minGrade?: string) {
    const mg = minGrade ? Number(minGrade) : 50;
    return this.studentsService.passed(mg);
  }

  @Get('averagegrade') // GET /api/students/averagegrade
  averageGrade() {
    return { average: this.studentsService.averageGrade() };
  }

  @Get(':id') // GET /api/students/:id
  byId(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.studentsService.findById(id);
  }

  @Delete(':id') // DELETE /api/students/:id
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.studentsService.remove(id);
    return { deleted: true };
  }

  @Put(':id') // PUT /api/students/:id
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, dto);
  }

  @Post() // POST /api/students
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }
}
