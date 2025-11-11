import { Module } from '@nestjs/common';
import { PasswordHasher } from 'src/domain/password-hasher/password-hasher';
import { UserSessionGuard } from 'src/user-session/user-session.guard';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UserModule],
  controllers: [UserController],
  providers: [UserService, PasswordHasher, UserSessionGuard],
})
export class UserModule {}
