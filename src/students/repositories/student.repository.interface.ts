import { StudentEntity } from '../entities/student.entity';

export interface IStudentRepository {
  create(data: Partial<StudentEntity>): StudentEntity;
  save(entity: StudentEntity): Promise<StudentEntity>;
  find(options?: { where?: Partial<StudentEntity>; order?: Record<string, 'ASC' | 'DESC'> }): Promise<StudentEntity[]>;
  findOneBy(criteria: Partial<StudentEntity>): Promise<StudentEntity | null>;
  merge(entity: StudentEntity, data: Partial<StudentEntity>): StudentEntity;
  delete(id: string): Promise<{ affected?: number | null }>;
  count(): Promise<number>;
  findWithGradeGreaterOrEqual(minGrade: number): Promise<StudentEntity[]>;
  getAverageGrade(): Promise<number>;
  /** Inserts all items only when the table is empty; no-op otherwise. */
  seedIfEmpty(data: Partial<StudentEntity>[]): Promise<void>;
}

export const STUDENT_REPOSITORY = Symbol('STUDENT_REPOSITORY');
