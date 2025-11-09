import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, mockClear } from 'jest-mock-extended';
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
      service.registerUser.mockResolvedValue(undefined);

      await controller.createUser(userDto);

      expect(service.registerUser).toHaveBeenCalledTimes(1);
      expect(service.registerUser).toHaveBeenCalledWith(userDto);
    });

    it('서비스에서 발생한 에러를 그대로 던집니다', async () => {
      const error = new ConflictException('User already exists');
      service.registerUser.mockRejectedValue(error);

      await expect(controller.createUser(userDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(controller.createUser(userDto)).rejects.toStrictEqual(error);
    });
  });
});
