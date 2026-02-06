import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { TeacherModel } from '../models/teacher.model';
import {
  ITeacherRepository,
  TeacherFindManyOptions,
} from './teacher.repository.interface';

function toModel(row: {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  createdAt: Date;
}): TeacherModel {
  return {
    id: row.id,
    userId: row.userId,
    fullName: row.fullName,
    email: row.email,
    createdAt: row.createdAt,
  };
}

@Injectable()
export class TeacherRepositoryPrisma implements ITeacherRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(search?: string): Prisma.TeacherWhereInput | undefined {
    if (!search?.trim()) return undefined;
    const term = search.trim();
    return {
      OR: [
        { fullName: { contains: term, mode: 'insensitive' } },
        { email: { contains: term, mode: 'insensitive' } },
      ],
    };
  }

  async findMany(options: TeacherFindManyOptions): Promise<TeacherModel[]> {
    const where = this.buildWhere(options.search);
    const rows = await this.prisma.teacher.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(toModel);
  }

  async count(options?: { search?: string }): Promise<number> {
    const where = this.buildWhere(options?.search);
    return this.prisma.teacher.count({ where });
  }

  async findOneBy(criteria: Partial<TeacherModel>): Promise<TeacherModel | null> {
    const where: Prisma.TeacherWhereInput = {};
    if (criteria.id != null) where.id = criteria.id;
    if (criteria.userId != null) where.userId = criteria.userId;
    if (criteria.email != null) where.email = criteria.email;
    if (criteria.fullName != null) where.fullName = criteria.fullName;
    const row = await this.prisma.teacher.findFirst({ where });
    return row ? toModel(row) : null;
  }

  create(data: Partial<TeacherModel>): TeacherModel {
    return {
      id: (data.id as string) ?? '',
      userId: data.userId ?? '',
      fullName: data.fullName ?? '',
      email: data.email ?? '',
      createdAt: data.createdAt ?? new Date(),
    };
  }

  async save(entity: TeacherModel): Promise<TeacherModel> {
    const payload = {
      userId: entity.userId,
      fullName: entity.fullName,
      email: entity.email,
    };
    if (entity.id) {
      const updated = await this.prisma.teacher.update({
        where: { id: entity.id },
        data: payload,
      });
      return toModel(updated);
    }
    const created = await this.prisma.teacher.create({ data: payload });
    return toModel(created);
  }

  merge(entity: TeacherModel, data: Partial<TeacherModel>): TeacherModel {
    return { ...entity, ...data };
  }

  async delete(id: string): Promise<{ affected?: number | null }> {
    try {
      await this.prisma.teacher.delete({ where: { id } });
      return { affected: 1 };
    } catch {
      return { affected: 0 };
    }
  }
}
