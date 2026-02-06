import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { USER_REPOSITORY, type IUserRepository } from './repositories';
import { UserModel } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly repository: IUserRepository,
  ) {}

  async findByEmail(email: string): Promise<UserModel | null> {
    return this.repository.findByEmail(email);
  }

  async findById(id: string): Promise<UserModel | null> {
    return this.repository.findById(id);
  }

  async create(data: {
    email: string;
    passwordHash: string;
    role: Role;
    isActive?: boolean;
  }): Promise<UserModel> {
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new ConflictException(`User with email ${data.email} already exists`);
    }
    return this.repository.create({
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      role: data.role,
      isActive: data.isActive ?? true,
      refreshTokenHash: null,
    });
  }

  async updateRefreshTokenHash(userId: string, hash: string | null): Promise<void> {
    await this.repository.updateRefreshTokenHash(userId, hash);
  }
}
