import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { PointHistoryEntity, PointType } from '../entity/point-history.entity';
import { UserEntity } from '../entity/user.entity';
import { PointHistoryRepository } from './point-history.repository';

describe('PointHistoryRepository', () => {
  let pointHistoryRepository: PointHistoryRepository;
  let dataSource: DataSource;
  let em: EntityManager;

  const TEST_USER = { id: 'testuser', password: 'password', point: 0 };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqljs',
          entities: [UserEntity, PointHistoryEntity],
          synchronize: true,
        }),
      ],
      providers: [PointHistoryRepository],
    }).compile();

    pointHistoryRepository = module.get<PointHistoryRepository>(
      PointHistoryRepository,
    );
    dataSource = module.get<DataSource>(DataSource);
    em = dataSource.createEntityManager();
  });

  beforeEach(async () => {
    await em.clear(PointHistoryEntity);
    await em.clear(UserEntity);

    const user = em.create(UserEntity, TEST_USER);
    await em.save(user);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('insert', () => {
    it('포인트 내역을 성공적으로 추가해야 한다', async () => {
      const amount = 100;
      const type = PointType.EARN;

      await pointHistoryRepository.insert(em, TEST_USER.id, amount, type);

      const history = await em.find(PointHistoryEntity, {
        where: { user: { id: TEST_USER.id } },
        relations: { user: true },
      });

      expect(history).toHaveLength(1);
      expect(history[0].amount).toBe(amount);
      expect(history[0].type).toBe(type);
      expect(history[0].user.id).toBe(TEST_USER.id);
    });
  });

  describe('findHistoryByUserId', () => {
    it('포인트 내역이 없으면 빈 배열을 반환해야 한다', async () => {
      const history = await pointHistoryRepository.findHistoryByUserId(
        em,
        TEST_USER.id,
      );
      expect(history).toEqual([]);
    });

    it('사용자의 포인트 내역을 최신순으로 조회해야 한다 (커서 없음)', async () => {
      const now = new Date();
      const history1 = em.create(PointHistoryEntity, {
        user: TEST_USER,
        amount: 100,
        type: PointType.EARN,
        createdAt: new Date(now.getTime() - 2000),
      });
      const history2 = em.create(PointHistoryEntity, {
        user: TEST_USER,
        amount: 200,
        type: PointType.SPEND,
        createdAt: new Date(now.getTime() - 1000),
      });
      const history3 = em.create(PointHistoryEntity, {
        user: TEST_USER,
        amount: 300,
        type: PointType.EARN,
        createdAt: now,
      });
      await em.save([history1, history2, history3]);

      const history = await pointHistoryRepository.findHistoryByUserId(
        em,
        TEST_USER.id,
      );

      expect(history).toHaveLength(3);
      expect(history[0].amount).toBe(history3.amount);
      expect(history[1].amount).toBe(history2.amount);
      expect(history[2].amount).toBe(history1.amount);
    });

    it('historyId 커서를 사용하여 해당 ID 이전의 내역을 최신순으로 조회해야 한다', async () => {
      const now = new Date();
      const history1 = em.create(PointHistoryEntity, {
        user: TEST_USER,
        amount: 100,
        type: PointType.EARN,
        createdAt: new Date(now.getTime() - 3000),
      });
      const history2 = em.create(PointHistoryEntity, {
        user: TEST_USER,
        amount: 200,
        type: PointType.SPEND,
        createdAt: new Date(now.getTime() - 2000),
      });
      const history3 = em.create(PointHistoryEntity, {
        user: TEST_USER,
        amount: 300,
        type: PointType.EARN,
        createdAt: new Date(now.getTime() - 1000),
      });
      const history4 = em.create(PointHistoryEntity, {
        user: TEST_USER,
        amount: 400,
        type: PointType.SPEND,
        createdAt: now,
      });
      await em.save([history1, history2, history3, history4]);

      const history = await pointHistoryRepository.findHistoryByUserId(
        em,
        TEST_USER.id,
        // 다음 레코드의 아이디
        history3.id,
      );

      expect(history).toHaveLength(2);
      expect(history[0].amount).toBe(history2.amount);
      expect(history[1].amount).toBe(history1.amount);
    });

    it('limit을 사용하여 조회 개수를 제한해야 한다', async () => {
      const now = new Date();

      for (let i = 0; i < 15; i++) {
        const history = em.create(PointHistoryEntity, {
          user: TEST_USER,
          amount: 10 + i,
          type: PointType.EARN,
          createdAt: new Date(now.getTime() - i * 1000),
        });
        await em.save(history);
      }

      const history = await pointHistoryRepository.findHistoryByUserId(
        em,
        TEST_USER.id,
        undefined,
        5,
      );

      expect(history).toHaveLength(5);
    });
  });
});
