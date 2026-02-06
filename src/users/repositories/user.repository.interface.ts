import { UserModel } from '../models/user.model';

export interface IUserRepository {
  create(data: Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserModel>;
  findById(id: string): Promise<UserModel | null>;
  findByEmail(email: string): Promise<UserModel | null>;
  updateRefreshTokenHash(userId: string, hash: string | null): Promise<void>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
