import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CourseModel } from '../models/course.model';
import {
  CourseFindManyOptions,
  ICourseRepository,
} from './course.repository.interface';

function toModel(row: {
  id: string;
  title: string;
  code: string;
  createdAt: Date;
  teacherId: string;
}): CourseModel {
  return {
    id: row.id,
    title: row.title,
    code: row.code,
    createdAt: row.createdAt,
    teacherId: row.teacherId,
  };
}

@Injectable()
export class CourseRepositoryPrisma implements ICourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(options?: {
    search?: string;
    teacherId?: string;
  }): Prisma.CourseWhereInput | undefined {
    if (!options) return undefined;
    const and: Prisma.CourseWhereInput[] = [];
    if (options.teacherId) and.push({ teacherId: options.teacherId });
    if (options.search?.trim()) {
      const term = options.search.trim();
      and.push({
        OR: [
          { title: { contains: term, mode: 'insensitive' } },
          { code: { contains: term, mode: 'insensitive' } },
        ],
      });
    }
    return and.length > 0 ? { AND: and } : undefined;
  }

  async findMany(options: CourseFindManyOptions): Promise<CourseModel[]> {
    const where = this.buildWhere({
      search: options.search,
      teacherId: options.teacherId,
    });
    const rows = await this.prisma.course.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(toModel);
  }

  async count(options?: {
    search?: string;
    teacherId?: string;
  }): Promise<number> {
    const where = this.buildWhere(options);
    return this.prisma.course.count({ where });
  }

  async findOneBy(criteria: Partial<CourseModel>): Promise<CourseModel | null> {
    const where: Prisma.CourseWhereInput = {};
    if (criteria.id != null) where.id = criteria.id;
    if (criteria.code != null) where.code = criteria.code;
    if (criteria.teacherId != null) where.teacherId = criteria.teacherId;
    const row = await this.prisma.course.findFirst({ where });
    return row ? toModel(row) : null;
  }

  create(data: Partial<CourseModel>): CourseModel {
    return {
      id: (data.id as string) ?? '',
      title: data.title ?? '',
      code: data.code ?? '',
      createdAt: data.createdAt ?? new Date(),
      teacherId: data.teacherId ?? '',
    };
  }

  async save(entity: CourseModel): Promise<CourseModel> {
    const payload = {
      title: entity.title,
      code: entity.code,
      teacherId: entity.teacherId,
    };
    if (entity.id) {
      const updated = await this.prisma.course.update({
        where: { id: entity.id },
        data: payload,
      });
      return toModel(updated);
    }
    const created = await this.prisma.course.create({
      data: payload,
    });
    return toModel(created);
  }

  merge(entity: CourseModel, data: Partial<CourseModel>): CourseModel {
    return { ...entity, ...data };
  }

  async delete(id: string): Promise<{ affected?: number | null }> {
    try {
      await this.prisma.course.delete({ where: { id } });
      return { affected: 1 };
    } catch {
      return { affected: 0 };
    }
  }
}
