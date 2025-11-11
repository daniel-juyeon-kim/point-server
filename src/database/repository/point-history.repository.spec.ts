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
    await em.query('DELETE FROM point_history_entity');
    await em.query('DELETE FROM user_entity');

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
});
