import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PointType } from '../database/entity/point-history.entity';
import { PointHistoryRepository } from '../database/repository/point-history.repository';
import { UserRepository } from '../database/repository/user.repository';
import { EarnDto } from './dto/earn.dto';

@Injectable()
export class ApiService {
  constructor(
    private readonly ds: DataSource,
    private readonly userRepository: UserRepository,
    private readonly pointHistoryRepository: PointHistoryRepository,
  ) {}

  async earnPoints(userId: string, { amount }: EarnDto) {
    return await this.ds.transaction(async (em) => {
      const point = await this.userRepository.findPointById(em, userId);

      if (point === undefined) {
        throw new NotFoundException(
          `ID가 '${userId}'인 사용자를 찾을 수 없습니다.`,
        );
      }

      const currentPoint = point + amount;

      await this.userRepository.updatePointById(em, userId, currentPoint);
      await this.pointHistoryRepository.insert(
        em,
        userId,
        amount,
        PointType.EARN,
      );

      return currentPoint;
    });
  }

  async getBalance(userId: string): Promise<number> {
    return await this.ds.transaction(async (em) => {
      const point = await this.userRepository.findPointById(em, userId);

      if (point === undefined) {
        throw new NotFoundException(
          `ID가 '${userId}'인 사용자를 찾을 수 없습니다.`,
        );
      }

      return point;
    });
  }
}
