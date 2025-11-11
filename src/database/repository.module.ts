import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointHistoryRepository } from './repository/point-history.repository';
import { UserRepository } from './repository/user.repository';

const repositories = [UserRepository, PointHistoryRepository];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [...repositories],
  exports: [...repositories],
})
export class RepositoryModule {}
