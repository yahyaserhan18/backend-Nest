import { TeacherModel } from '../models/teacher.model';

export interface TeacherFindManyOptions {
  skip: number;
  take: number;
  search?: string;
}

export interface ITeacherRepository {
  findMany(options: TeacherFindManyOptions): Promise<TeacherModel[]>;
  count(options?: { search?: string }): Promise<number>;
  findOneBy(criteria: Partial<TeacherModel>): Promise<TeacherModel | null>;
  create(data: Partial<TeacherModel>): TeacherModel;
  save(entity: TeacherModel): Promise<TeacherModel>;
  merge(entity: TeacherModel, data: Partial<TeacherModel>): TeacherModel;
  delete(id: string): Promise<{ affected?: number | null }>;
}

export const TEACHER_REPOSITORY = Symbol('TEACHER_REPOSITORY');
