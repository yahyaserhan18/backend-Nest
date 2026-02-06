import { Module } from '@nestjs/common';
import {
  COURSE_REPOSITORY,
  CourseRepositoryPrisma,
} from './repositories';
import { CoursesController } from './courses.controller';
import { CoursesSeedService } from './courses-seed.service';
import { CoursesService } from './courses.service';
import { CourseOwnerGuard } from './guards/course-owner.guard';

@Module({
  controllers: [CoursesController],
  providers: [
    {
      provide: COURSE_REPOSITORY,
      useClass: CourseRepositoryPrisma,
    },
    CoursesService,
    CoursesSeedService,
    CourseOwnerGuard,
  ],
  exports: [COURSE_REPOSITORY, CoursesSeedService],
})
export class CoursesModule {}
