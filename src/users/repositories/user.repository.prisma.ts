import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserModel } from '../models/user.model';
import { IUserRepository } from './user.repository.interface';

function toModel(row: {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  isActive: boolean;
  refreshTokenHash: string | null;
  createdAt: Date;
  updatedAt: Date;
  teacher?: { id: string } | null;
  student?: { id: string } | null;
}): UserModel {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    role: row.role,
    isActive: row.isActive,
    refreshTokenHash: row.refreshTokenHash,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    teacherId: row.teacher?.id ?? null,
    studentId: row.student?.id ?? null,
  };
}

@Injectable()
export class UserRepositoryPrisma implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserModel> {
    const created = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
        isActive: data.isActive,
        refreshTokenHash: data.refreshTokenHash ?? undefined,
      },
    });
    return toModel(created);
  }

  async findById(id: string): Promise<UserModel | null> {
    const row = await this.prisma.user.findUnique({
      where: { id },
      include: {
        teacher: { select: { id: true } },
        student: { select: { id: true } },
      },
    });
    return row ? toModel(row) : null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const row = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        teacher: { select: { id: true } },
        student: { select: { id: true } },
      },
    });
    return row ? toModel(row) : null;
  }

  async updateRefreshTokenHash(userId: string, hash: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
    });
  }
}
