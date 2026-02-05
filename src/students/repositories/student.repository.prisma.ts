import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { StudentEntity } from '../entities/student.entity';
import { IStudentRepository } from './student.repository.interface';

function toEntity(row: {
  id: string;
  name: string;
  age: number;
  grade: number;
  isActive: boolean;
  createdAt: Date;
}): StudentEntity {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    grade: row.grade,
    isActive: row.isActive,
    createdAt: row.createdAt,
  };
}

@Injectable()
export class StudentRepositoryPrisma implements IStudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Partial<StudentEntity>): StudentEntity {
    return {
      id: (data.id as string) ?? '',
      name: data.name ?? '',
      age: data.age ?? 0,
      grade: data.grade ?? 0,
      isActive: data.isActive ?? true,
      createdAt: data.createdAt ?? new Date(),
    };
  }

  async save(entity: StudentEntity): Promise<StudentEntity> {
    const payload: Prisma.StudentCreateInput = {
      name: entity.name,
      age: entity.age,
      grade: entity.grade,
      isActive: entity.isActive,
    };
    if (entity.id) {
      const updated = await this.prisma.student.update({
        where: { id: entity.id },
        data: {
          name: payload.name,
          age: payload.age,
          grade: payload.grade,
          isActive: payload.isActive,
        },
      });
      return toEntity(updated);
    }
    const created = await this.prisma.student.create({
      data: payload,
    });
    return toEntity(created);
  }

  async find(options?: {
    where?: Partial<StudentEntity>;
    order?: Record<string, 'ASC' | 'DESC'>;
  }): Promise<StudentEntity[]> {
    const where = options?.where
      ? {
          ...(options.where.id && { id: options.where.id }),
          ...(options.where.name != null && { name: options.where.name }),
          ...(options.where.age != null && { age: options.where.age }),
          ...(options.where.grade != null && { grade: options.where.grade }),
          ...(options.where.isActive != null && { isActive: options.where.isActive }),
        }
      : undefined;
    const orderBy = options?.order
      ? (Object.entries(options.order).map(([k, v]) => ({
          [k]: v === 'DESC' ? 'desc' : 'asc',
        })) as Prisma.StudentOrderByWithRelationInput[])
      : undefined;
    const rows = await this.prisma.student.findMany({ where, orderBy });
    return rows.map(toEntity);
  }

  async findOneBy(criteria: Partial<StudentEntity>): Promise<StudentEntity | null> {
    const where: Prisma.StudentWhereInput = {};
    if (criteria.id != null) where.id = criteria.id;
    if (criteria.name != null) where.name = criteria.name;
    if (criteria.age != null) where.age = criteria.age;
    if (criteria.grade != null) where.grade = criteria.grade;
    if (criteria.isActive != null) where.isActive = criteria.isActive;
    const row = await this.prisma.student.findFirst({ where });
    return row ? toEntity(row) : null;
  }

  merge(entity: StudentEntity, data: Partial<StudentEntity>): StudentEntity {
    return {
      ...entity,
      ...data,
    };
  }

  async delete(id: string): Promise<{ affected?: number | null }> {
    try {
      await this.prisma.student.delete({ where: { id } });
      return { affected: 1 };
    } catch {
      return { affected: 0 };
    }
  }

  async count(): Promise<number> {
    return this.prisma.student.count();
  }

  async findWithGradeGreaterOrEqual(minGrade: number): Promise<StudentEntity[]> {
    const rows = await this.prisma.student.findMany({
      where: { grade: { gte: minGrade } },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(toEntity);
  }

  async getAverageGrade(): Promise<number> {
    const result = await this.prisma.student.aggregate({
      _avg: { grade: true },
    });
    const avg = result._avg.grade ?? 0;
    return Math.round(avg * 100) / 100;
  }

  async seedIfEmpty(data: Partial<StudentEntity>[]): Promise<void> {
    const count = await this.prisma.student.count();
    if (count > 0) return;

    await this.prisma.student.createMany({
      data: data.map((row) => ({
        ...(row.id && { id: row.id }),
        name: row.name!,
        age: row.age!,
        grade: row.grade!,
        isActive: row.isActive ?? true,
      })),
    });
  }
}
