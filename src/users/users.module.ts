import { Module } from '@nestjs/common';
import { USER_REPOSITORY, UserRepositoryPrisma } from './repositories';
import { UsersService } from './users.service';

@Module({
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryPrisma,
    },
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
