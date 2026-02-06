import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { teachersSeedData } from './seed';

const SEED_PASSWORD = 'SeedPassword1!';

@Injectable()
export class TeachersSeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seed(): Promise<void> {
    const count = await this.prisma.teacher.count();
    if (count > 0) return;

    const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
    for (const row of teachersSeedData) {
      const user = await this.prisma.user.create({
        data: {
          email: row.email,
          passwordHash,
          role: Role.TEACHER,
          isActive: true,
        },
      });
      await this.prisma.teacher.create({
        data: {
          id: row.id,
          userId: user.id,
          fullName: row.fullName,
          email: row.email,
        },
      });
    }
  }
}
