import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, mockClear } from 'jest-mock-extended';
import { UserSession } from '../domain/user-session.interface';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { UserDto } from './dto/user.dto';

describe('ApiController', () => {
  let controller: ApiController;
  const service = mock<ApiService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [{ provide: ApiService, useValue: service }],
    }).compile();

    controller = module.get<ApiController>(ApiController);
  });

  afterEach(() => {
    mockClear(service);
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

      await expect(controller.createUser(userDto)).rejects.toStrictEqual(
        new ConflictException('User already exists'),
      );
    });
  });

  describe('login', () => {
    const userDto: UserDto = { id: 'testuser', password: 'password123' };
    const session = {} as UserSession;

    it('ApiService의 loginUser를 올바른 DTO와 세션과 함께 호출합니다', async () => {
      await controller.login(userDto, session);

      expect(service.loginUser).toHaveBeenCalledWith(userDto, session);
    });

    it('서비스에서 발생한 에러를 그대로 던집니다', async () => {
      const error = new UnauthorizedException('Invalid credentials');
      service.loginUser.mockRejectedValue(error);

      await expect(controller.login(userDto, session)).rejects.toStrictEqual(
        new UnauthorizedException('Invalid credentials'),
      );
    });
  });
});
