import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, mockClear } from 'jest-mock-extended';
import { PartialUserSession } from 'src/domain/user-session.interface';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../database/repository/user.repository';
import { UserDto } from './dto/user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  const service = mock<UserService>();
  const userRepository = mock<UserRepository>();
  const ds = mock<DataSource>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: service },
        { provide: UserRepository, useValue: userRepository },
        { provide: DataSource, useValue: ds },
      ],
    }).compile();

    controller = module.get(UserController);
  });

  afterEach(() => {
    mockClear(service);
    mockClear(userRepository);
    mockClear(ds);
  });

  describe('createUser', () => {
    const userDto: UserDto = { id: 'testuser', password: 'password123' };

    it('ApiService의 registerUser를 올바른 DTO와 함께 호출합니다', async () => {
      await controller.createUser(userDto);

      expect(service.registerUser).toHaveBeenCalledWith(userDto);
    });

    it('서비스에서 발생한 에러를 그대로 던집니다', async () => {
      const error = new ConflictException('User already exists');
      service.registerUser.mockRejectedValue(error);

      await expect(controller.createUser(userDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const userDto: UserDto = { id: 'testuser', password: 'password123' };
    const session = {} as PartialUserSession;

    it('ApiService의 loginUser를 올바른 DTO와 세션과 함께 호출합니다', async () => {
      await controller.login(userDto, session);

      expect(service.loginUser).toHaveBeenCalledWith(userDto, session);
    });

    it('서비스에서 발생한 에러를 그대로 던집니다', async () => {
      const error = new UnauthorizedException('Invalid credentials');
      service.loginUser.mockRejectedValue(error);

      await expect(controller.login(userDto, session)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
