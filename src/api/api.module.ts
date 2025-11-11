import { Module } from '@nestjs/common';
import { PasswordHasher } from 'src/domain/password-hasher/password-hasher';
import { UserSessionGuard } from 'src/user-session/user-session.guard';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ApiController],
  providers: [ApiService, PasswordHasher, UserSessionGuard],
})
export class ApiModule {}
