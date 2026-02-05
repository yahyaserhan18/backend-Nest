import { Module } from '@nestjs/common';
import {
  TEACHER_REPOSITORY,
  TeacherRepositoryPrisma,
} from './repositories';
import { TeachersController } from './teachers.controller';
import { TeachersSeedService } from './teachers-seed.service';
import { TeachersService } from './teachers.service';

@Module({
  controllers: [TeachersController],
  providers: [
    {
      provide: TEACHER_REPOSITORY,
      useClass: TeacherRepositoryPrisma,
    },
    TeachersService,
    TeachersSeedService,
  ],
  exports: [TEACHER_REPOSITORY, TeachersSeedService],
})
export class TeachersModule {}
