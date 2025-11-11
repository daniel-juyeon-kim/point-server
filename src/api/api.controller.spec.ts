import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, mockClear } from 'jest-mock-extended';
import { DataSource } from 'typeorm';
import { UserRepository } from '../database/repository/user.repository';
import { UserSession } from '../domain/user-session.interface';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { EarnDto } from './dto/earn.dto';

describe('ApiController', () => {
  let controller: ApiController;
  const service = mock<ApiService>();
  const userRepository = mock<UserRepository>();
  const ds = mock<DataSource>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        { provide: ApiService, useValue: service },
        { provide: UserRepository, useValue: userRepository },
        { provide: DataSource, useValue: ds },
      ],
    }).compile();

    controller = module.get<ApiController>(ApiController);
  });

  afterEach(() => {
    mockClear(service);
    mockClear(userRepository);
    mockClear(ds);
  });

  describe('earnPoints', () => {
    const userId = 'testuser';
    const earnAmount = 500;
    const earnDto: EarnDto = { amount: earnAmount };
    const session = { userId } as UserSession;

    it('ApiService의 earnPoints를 올바른 userId와 DTO와 함께 호출하고 결과를 반환합니다', async () => {
      service.earnPoints.mockResolvedValue(earnAmount);

      const result = await controller.earn(session, earnDto);

      expect(service.earnPoints).toHaveBeenCalledWith(userId, earnDto);
      expect(result).toBe(earnAmount);
    });

    it('서비스에서 NotFoundException이 발생하면 그대로 던집니다', async () => {
      const error = new NotFoundException(
        `ID가 '${userId}'인 사용자를 찾을 수 없습니다.`,
      );
      service.earnPoints.mockRejectedValue(error);

      await expect(controller.earn(session, earnDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.earnPoints).toHaveBeenCalledWith(userId, earnDto);
    });
  });

  describe('getBalance', () => {
    const userId = 'testuser';
    const balance = 1000;
    const session = { userId } as UserSession;

    it('ApiService의 getBalance를 올바른 userId와 함께 호출하고 결과를 반환합니다', async () => {
      service.getBalance.mockResolvedValue(balance);

      const result = await controller.getBalance(session);

      expect(service.getBalance).toHaveBeenCalledWith(userId);
      expect(result).toBe(balance);
    });

    it('서비스에서 NotFoundException이 발생하면 그대로 던집니다', async () => {
      const error = new NotFoundException(
        `ID가 '${userId}'인 사용자를 찾을 수 없습니다.`,
      );
      service.getBalance.mockRejectedValue(error);

      await expect(controller.getBalance(session)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.getBalance).toHaveBeenCalledWith(userId);
    });
  });
});
