import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { UserDto } from '../../api/user/dto/user.dto';
import { PointHistoryEntity } from '../entity/point-history.entity';
import { UserEntity } from '../entity/user.entity';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let module: TestingModule;
  let userRepository: UserRepository;
  let dataSource: DataSource;
  let entityManager: EntityManager;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqljs',
          entities: [UserEntity, PointHistoryEntity],
          synchronize: true,
        }),
      ],
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    dataSource = module.get<DataSource>(DataSource);
    entityManager = dataSource.manager;
  });

  afterEach(async () => {
    await entityManager.clear(UserEntity);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('existBy', () => {
    it('사용자가 존재하면 true를 반환합니다', async () => {
      const testUser: UserDto = { id: 'testuser', password: 'password' };
      const user = entityManager.create(UserEntity, testUser);
      await entityManager.save(user);

      const result = await userRepository.existBy(entityManager, testUser.id);

      expect(result).toBe(true);
    });

    it('사용자가 존재하지 않으면 false를 반환합니다', async () => {
      const result = await userRepository.existBy(entityManager, 'nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('insert', () => {
    it('새로운 사용자를 성공적으로 추가합니다', async () => {
      const newUserDto: UserDto = { id: 'newuser', password: 'hashedpassword' };

      await userRepository.insert(entityManager, newUserDto);

      const foundUser = await entityManager.findOneBy(UserEntity, {
        id: newUserDto.id,
      });
      expect(foundUser).not.toBeNull();
      expect(foundUser?.id).toBe(newUserDto.id);
      expect(foundUser?.password).toBe(newUserDto.password);
    });

    it('이미 존재하는 ID로 추가 시 데이터베이스 에러를 던집니다', async () => {
      const existUserDto: UserDto = { id: 'existuser', password: 'password' };
      await userRepository.insert(entityManager, existUserDto);

      await expect(
        userRepository.insert(entityManager, existUserDto),
      ).rejects.toThrow();
    });
  });

  describe('findPasswordById', () => {
    it('사용자가 존재하면 비밀번호를 반환합니다', async () => {
      const testUser: UserDto = { id: 'testuser', password: 'password' };
      const user = entityManager.create(UserEntity, testUser);
      await entityManager.save(user);

      const password = await userRepository.findPasswordById(
        entityManager,
        testUser.id,
      );

      expect(user.password).toEqual(password);
    });

    it('사용자가 존재하지 않으면 NotFoundException을 던집니다', async () => {
      await expect(
        userRepository.findPasswordById(entityManager, 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findPointById', () => {
    it('사용자가 존재하면 포인트를 반환합니다', async () => {
      const testUser = { id: 'testuser', password: 'password', point: 500 };
      const user = entityManager.create(UserEntity, testUser);
      await entityManager.save(user);

      const point = await userRepository.findPointById(
        entityManager,
        testUser.id,
      );

      expect(point).toBe(testUser.point);
    });

    it('사용자가 존재하지 않으면 undefined를 반환합니다', async () => {
      const point = await userRepository.findPointById(
        entityManager,
        'nonexistent',
      );

      expect(point).toBeUndefined();
    });
  });

  describe('updatePointById', () => {
    it('사용자의 포인트를 성공적으로 업데이트합니다', async () => {
      const testUser = { id: 'testuser', password: 'password', point: 500 };
      const user = entityManager.create(UserEntity, testUser);
      await entityManager.save(user);

      const newPointValue = 1500;
      await userRepository.updatePointById(
        entityManager,
        testUser.id,
        newPointValue,
      );

      const updatedUser = await entityManager.findOneBy(UserEntity, {
        id: testUser.id,
      });
      expect(updatedUser?.point).toBe(newPointValue);
    });
  });
});
