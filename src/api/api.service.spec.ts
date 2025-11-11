import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { mock, mockReset } from 'jest-mock-extended';
import { DataSource, EntityManager } from 'typeorm';
import { PointType } from '../database/entity/point-history.entity';
import { PointHistoryRepository } from '../database/repository/point-history.repository';
import { UserRepository } from '../database/repository/user.repository';
import { ApiService } from './api.service';
import { EarnDto } from './dto/earn.dto';

describe('ApiService', () => {
  let service: ApiService;
  const ds = mock<DataSource>();
  const em = mock<EntityManager>();
  const userRepository = mock<UserRepository>();
  const pointHistoryRepository = mock<PointHistoryRepository>();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ApiService,
        { provide: DataSource, useValue: ds },
        { provide: UserRepository, useValue: userRepository },
        { provide: PointHistoryRepository, useValue: pointHistoryRepository },
      ],
    }).compile();

    service = module.get(ApiService);
  });

  beforeEach(() => {
    ds.transaction.mockImplementation((cb) => {
      return cb(em);
    });
  });

  afterEach(() => {
    mockReset(ds);
    mockReset(em);
    mockReset(userRepository);
    mockReset(pointHistoryRepository);
  });

  describe('earnPoints', () => {
    const userId = 'testuser';
    const initialPoint = 100;
    const earnAmount = 500;
    const earnDto: EarnDto = { amount: earnAmount };

    it('사용자 포인트를 성공적으로 적립하고 히스토리를 기록해야 한다', async () => {
      userRepository.findPointById.mockResolvedValue(initialPoint);
      userRepository.updatePointById.mockResolvedValue(undefined);
      pointHistoryRepository.insert.mockResolvedValue(undefined);

      const result = await service.earnPoints(userId, earnDto);

      expect(result).toBe(initialPoint + earnAmount);
      expect(userRepository.findPointById).toHaveBeenCalledWith(em, userId);
      expect(userRepository.updatePointById).toHaveBeenCalledWith(
        em,
        userId,
        initialPoint + earnAmount,
      );
      expect(pointHistoryRepository.insert).toHaveBeenCalledWith(
        em,
        userId,
        earnAmount,
        PointType.EARN,
      );
    });

    it('존재하지 않는 사용자의 포인트를 적립하려 하면 NotFoundException을 던져야 한다', async () => {
      userRepository.findPointById.mockResolvedValue(undefined);

      await expect(service.earnPoints('nonexistent', earnDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.updatePointById).not.toHaveBeenCalled();
      expect(pointHistoryRepository.insert).not.toHaveBeenCalled();
    });
  });
});
