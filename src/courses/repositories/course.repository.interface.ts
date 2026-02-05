import { CourseModel } from '../models/course.model';

export interface CourseFindManyOptions {
  skip: number;
  take: number;
  search?: string;
  teacherId?: string;
}

export interface ICourseRepository {
  findMany(options: CourseFindManyOptions): Promise<CourseModel[]>;
  count(options?: { search?: string; teacherId?: string }): Promise<number>;
  findOneBy(criteria: Partial<CourseModel>): Promise<CourseModel | null>;
  create(data: Partial<CourseModel>): CourseModel;
  save(entity: CourseModel): Promise<CourseModel>;
  merge(entity: CourseModel, data: Partial<CourseModel>): CourseModel;
  delete(id: string): Promise<{ affected?: number | null }>;
}

export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');
