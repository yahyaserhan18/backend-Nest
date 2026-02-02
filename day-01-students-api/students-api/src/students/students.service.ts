import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { studentsSeed } from './seed';

@Injectable()
export class StudentsService {
  private students: Student[] = [];

  constructor() {
    // seed
    this.students = [...studentsSeed];
  }

  create(dto: CreateStudentDto): Student {
    const student: Student = {
      id: randomUUID(),
      name: dto.name,
      age: dto.age,
      grade: dto.grade,
      isActive: dto.isActive,
      createdAt: new Date(),
    };
    this.students.push(student);
    return student;
  }

  findAll(): Student[] {
    return this.students;
  }

  findById(id: string): Student {
    const s = this.students.find((x) => x.id === id);
    if (!s) throw new NotFoundException(`Student ${id} not found`);
    return s;
  }

  update(id: string, dto: UpdateStudentDto): Student {
    const s = this.findById(id);
    Object.assign(s, dto);
    return s;
  }

  remove(id: string): void {
    const before = this.students.length;
    this.students = this.students.filter((x) => x.id !== id);
    if (this.students.length === before) {
      throw new NotFoundException(`Student ${id} not found`);
    }
  }

  passed(minGrade = 50): Student[] {
    return this.students.filter((s) => s.grade >= minGrade);
  }

  averageGrade(): number {
    if (this.students.length === 0) return 0;
    const sum = this.students.reduce((acc, s) => acc + s.grade, 0);
    return Math.round((sum / this.students.length) * 100) / 100;
  }
}
