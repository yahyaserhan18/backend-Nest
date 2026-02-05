import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TraceLoggerService } from '../common/trace-logger.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeacherListQueryDto } from './dto/teacher-list-query.dto';
import { TeacherResponseDto } from './dto/teacher-response.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { toTeacherResponseDto } from './mappers/teacher.mapper';
import {
  type ITeacherRepository,
  TEACHER_REPOSITORY,
} from './repositories';
import { PrismaService } from '../prisma/prisma.service';
import { CourseResponseDto } from '../courses/dto/course-response.dto';

@Injectable()
export class TeachersService {
  constructor(
    @Inject(TEACHER_REPOSITORY)
    private readonly repository: ITeacherRepository,
    private readonly traceLogger: TraceLoggerService,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(
    query: TeacherListQueryDto,
  ): Promise<{ data: TeacherResponseDto[]; meta: { page: number; limit: number; total: number } }> {
    const skip = query.getSkip();
    const take = query.getTake();
    const [models, total] = await Promise.all([
      this.repository.findMany({
        skip,
        take,
        search: query.search,
      }),
      this.repository.count({ search: query.search }),
    ]);
    return {
      data: models.map(toTeacherResponseDto),
      meta: {
        page: query.page ?? 1,
        limit: query.limit ?? 20,
        total,
      },
    };
  }

  async findById(id: string): Promise<TeacherResponseDto> {
    const model = await this.repository.findOneBy({ id });
    if (!model) {
      this.traceLogger.warn(`Teacher not found: ${id}`);
      throw new NotFoundException(`Teacher ${id} not found`);
    }
    return toTeacherResponseDto(model);
  }

  async create(dto: CreateTeacherDto): Promise<TeacherResponseDto> {
    const model = this.repository.create({
      fullName: dto.fullName,
      email: dto.email,
    });
    const saved = await this.repository.save(model);
    return toTeacherResponseDto(saved);
  }

  async update(id: string, dto: UpdateTeacherDto): Promise<TeacherResponseDto> {
    const model = await this.repository.findOneBy({ id });
    if (!model) {
      this.traceLogger.warn(`Teacher not found: ${id}`);
      throw new NotFoundException(`Teacher ${id} not found`);
    }
    const merged = this.repository.merge(model, dto);
    const saved = await this.repository.save(merged);
    return toTeacherResponseDto(saved);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Teacher ${id} not found`);
    }
  }

  async getCoursesForTeacher(
    id: string,
  ): Promise<{ data: CourseResponseDto[]; meta: { total: number } }> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: { courses: true },
    });
    if (!teacher) {
      this.traceLogger.warn(`Teacher not found: ${id}`);
      throw new NotFoundException(`Teacher ${id} not found`);
    }
    const data: CourseResponseDto[] = teacher.courses.map((c) => ({
      id: c.id,
      title: c.title,
      code: c.code,
      createdAt: c.createdAt.toISOString(),
    }));
    return { data, meta: { total: data.length } };
  }
}
