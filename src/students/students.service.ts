import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentEntity } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly repository: Repository<StudentEntity>,
  ) {}

  async create(dto: CreateStudentDto): Promise<StudentEntity> {
    const entity = this.repository.create({
      name: dto.name,
      age: dto.age,
      grade: dto.grade,
      isActive: dto.isActive,
    });
    return this.repository.save(entity);
  }

  async findAll(): Promise<StudentEntity[]> {
    return this.repository.find({ order: { createdAt: 'ASC' } });
  }

  async findById(id: string): Promise<StudentEntity> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Student ${id} not found`);
    }
    return entity;
  }

  async update(id: string, dto: UpdateStudentDto): Promise<StudentEntity> {
    const entity = await this.findById(id);
    this.repository.merge(entity, dto);
    return this.repository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Student ${id} not found`);
    }
  }

  async passed(minGrade = 50): Promise<StudentEntity[]> {
    return this.repository.find({
      where: { grade: MoreThanOrEqual(minGrade) },
      order: { createdAt: 'ASC' },
    });
  }

  async averageGrade(): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('s')
      .select('AVG(s.grade)', 'avg')
      .getRawOne<{ avg: string | null }>();
    const avg = result?.avg ? parseFloat(result.avg) : 0;
    return Math.round(avg * 100) / 100;
  }
}
