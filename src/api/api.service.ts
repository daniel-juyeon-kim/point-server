import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PasswordHasher } from '../../src/domain/password-hasher/password-hasher';
import { UserDto } from './dto/user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class ApiService {
  constructor(
    private readonly ds: DataSource,
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async registerUser({ id, password }: UserDto) {
    try {
      await this.ds.transaction(async (em) => {
        const isExistUser = await this.userRepository.existBy(em, id);

        this.validateExistUser(isExistUser, id);

        const hashedPassword =
          await this.passwordHasher.hashOriginalPassword(password);

        await this.userRepository.insert(em, { id, password: hashedPassword });
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  private validateExistUser(isExistUser: boolean, id: string) {
    if (isExistUser) {
      const errorMessage = `${id}에 해당하는 사용자가 이미 존재합니다.`;

      throw new ConflictException(errorMessage);
    }
  }
}
