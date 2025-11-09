import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordHasher {
  private readonly rounds = 12;

  hashOriginalPassword(originalPassword: string) {
    return bcrypt.hash(originalPassword, this.rounds);
  }
}
