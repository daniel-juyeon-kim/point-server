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

  async findHistoryByUserId(
    em: EntityManager,
    userId: string,
    historyId?: number,
    limit = 10,
  ): Promise<PointHistoryEntity[]> {
    const queryBuilder = em
      .getRepository(this.entity)
      .createQueryBuilder('history')
      .where('history.userId = :userId', { userId })
      .orderBy('history.createdAt', 'DESC')
      .addOrderBy('history.id', 'DESC')
      .take(limit);

    if (historyId) {
      queryBuilder.andWhere('history.id < :historyId', { historyId });
    }

    return queryBuilder.getMany();
  }
}
