import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { PointHistoryEntity, PointType } from '../entity/point-history.entity';

@Injectable()
export class PointHistoryRepository {
  private readonly entity = PointHistoryEntity;

  async insert(
    em: EntityManager,
    userId: string,
    amount: number,
    type: PointType,
  ): Promise<void> {
    await em.insert(this.entity, {
      user: { id: userId },
      amount,
      type,
    });
  }
}
