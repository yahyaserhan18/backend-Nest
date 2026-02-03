import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEntity } from './entities/student.entity';
import { studentsSeedData } from './seed';

@Injectable()
export class StudentsSeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly repository: Repository<StudentEntity>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const count = await this.repository.count();
    if (count > 0) return;

    await this.repository.save(
      studentsSeedData.map((row) => this.repository.create(row)),
    );
  }
}
