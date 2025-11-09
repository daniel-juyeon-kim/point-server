import { Module } from '@nestjs/common';
import { PasswordHasher } from 'src/domain/password-hasher/password-hasher';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { UserRepository } from './user.repository';

@Module({
  controllers: [ApiController],
  providers: [ApiService, UserRepository, PasswordHasher],
})
export class ApiModule {}
