import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TraceLoggerService } from '../common/trace-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { toTeacherResponseDto } from '../teachers/mappers/teacher.mapper';
import { CreateCourseDto } from './dto/create-course.dto';
import { CourseDetailsResponseDto } from './dto/course-details-response.dto';
import { CourseListQueryDto } from './dto/course-list-query.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import {
  toCourseDetailsResponseDto,
  toCourseResponseDto,
} from './mappers/course.mapper';
import { CourseModel } from './models/course.model';
import {
  type ICourseRepository,
  COURSE_REPOSITORY,
} from './repositories';

@Injectable()
export class CoursesService {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly repository: ICourseRepository,
    private readonly traceLogger: TraceLoggerService,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(
    query: CourseListQueryDto,
  ): Promise<{
    data: CourseResponseDto[];
    meta: { page: number; limit: number; total: number };
  }> {
    const skip = query.getSkip();
    const take = query.getTake();
    const [models, total] = await Promise.all([
      this.repository.findMany({
        skip,
        take,
        search: query.search,
        teacherId: query.teacherId,
      }),
      this.repository.count({
        search: query.search,
        teacherId: query.teacherId,
      }),
    ]);
    return {
      data: models.map(toCourseResponseDto),
      meta: {
        page: query.page ?? 1,
        limit: query.limit ?? 20,
        total,
      },
    };
  }

  async findById(id: string): Promise<CourseResponseDto> {
    const model = await this.repository.findOneBy({ id });
    if (!model) {
      this.traceLogger.warn(`Course not found: ${id}`);
      throw new NotFoundException(`Course ${id} not found`);
    }
    return toCourseResponseDto(model);
  }

  async findByIdWithDetails(id: string): Promise<CourseDetailsResponseDto> {
    const row = await this.prisma.course.findUnique({
      where: { id },
      include: {
        teacher: true,
        _count: { select: { students: true } },
      },
    });
    if (!row) {
      this.traceLogger.warn(`Course not found: ${id}`);
      throw new NotFoundException(`Course ${id} not found`);
    }
    const courseModel: CourseModel = {
      id: row.id,
      title: row.title,
      code: row.code,
      createdAt: row.createdAt,
      teacherId: row.teacherId,
    };
    const teacherDto = toTeacherResponseDto(row.teacher);
    return toCourseDetailsResponseDto(
      courseModel,
      teacherDto,
      row._count.students,
    );
  }

  async create(dto: CreateCourseDto, currentTeacherId?: string): Promise<CourseResponseDto> {
    const teacherId = currentTeacherId ?? dto.teacherId;
    const model = this.repository.create({
      title: dto.title,
      code: dto.code,
      teacherId,
    });
    const saved = await this.repository.save(model);
    return toCourseResponseDto(saved);
  }

  async update(id: string, dto: UpdateCourseDto): Promise<CourseResponseDto> {
    const model = await this.repository.findOneBy({ id });
    if (!model) {
      this.traceLogger.warn(`Course not found: ${id}`);
      throw new NotFoundException(`Course ${id} not found`);
    }
    const merged = this.repository.merge(model, dto);
    const saved = await this.repository.save(merged);
    return toCourseResponseDto(saved);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Course ${id} not found`);
    }
  }

  async enrollStudent(courseId: string, studentId: string): Promise<void> {
    const [course, student] = await Promise.all([
      this.prisma.course.findUnique({ where: { id: courseId } }),
      this.prisma.student.findUnique({ where: { id: studentId } }),
    ]);
    if (!course) {
      this.traceLogger.warn(`Course not found: ${courseId}`);
      throw new NotFoundException(`Course ${courseId} not found`);
    }
    if (!student) {
      this.traceLogger.warn(`Student not found: ${studentId}`);
      throw new NotFoundException(`Student ${studentId} not found`);
    }
    await this.prisma.course.update({
      where: { id: courseId },
      data: { students: { connect: { id: studentId } } },
    });
  }

  async unenrollStudent(courseId: string, studentId: string): Promise<void> {
    const [course, student] = await Promise.all([
      this.prisma.course.findUnique({ where: { id: courseId } }),
      this.prisma.student.findUnique({ where: { id: studentId } }),
    ]);
    if (!course) {
      this.traceLogger.warn(`Course not found: ${courseId}`);
      throw new NotFoundException(`Course ${courseId} not found`);
    }
    if (!student) {
      this.traceLogger.warn(`Student not found: ${studentId}`);
      throw new NotFoundException(`Student ${studentId} not found`);
    }
    await this.prisma.course.update({
      where: { id: courseId },
      data: { students: { disconnect: { id: studentId } } },
    });
  }
}
