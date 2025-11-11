import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordHasher } from 'src/domain/password-hasher/password-hasher';
import { PartialUserSession } from 'src/domain/user-session.interface';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../database/repository/user.repository';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly INVALID_CREDENTIALS_MESSAGE =
    '아이디 또는 비밀번호가 올바르지 않습니다.';

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

  async loginUser({ id, password }: UserDto, session: PartialUserSession) {
    try {
      await this.ds.transaction(async (em) => {
        const isExistUser = await this.userRepository.existBy(em, id);

        this.validateNotExistUser(isExistUser);

        const hashedPassword = await this.userRepository.findPasswordById(
          em,
          id,
        );

        await this.validatePassword(password, hashedPassword);
      });

      this.setUserIdAtSession(session, id);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  private validateNotExistUser(isExistUser: boolean) {
    if (!isExistUser) {
      throw new UnauthorizedException(this.INVALID_CREDENTIALS_MESSAGE);
    }
  }

  private async validatePassword(
    originalPassword: string,
    hashedPassword: string,
  ) {
    const isValidUser = await this.passwordHasher.compare(
      originalPassword,
      hashedPassword,
    );

    if (isValidUser) {
      return;
    }

    throw new UnauthorizedException(this.INVALID_CREDENTIALS_MESSAGE);
  }

  private setUserIdAtSession(session: PartialUserSession, id: string) {
    session.userId = id;
    session.loginTime = new Date().toISOString();
  }
}
