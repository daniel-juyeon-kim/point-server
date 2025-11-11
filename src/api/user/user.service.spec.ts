import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { mock, mockReset } from 'jest-mock-extended';
import { PasswordHasher } from 'src/domain/password-hasher/password-hasher';
import { UserSession } from 'src/domain/user-session.interface';
import { DataSource, EntityManager } from 'typeorm';
import { PointHistoryRepository } from '../../database/repository/point-history.repository';
import { UserRepository } from '../../database/repository/user.repository';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  const ds = mock<DataSource>();
  const em = mock<EntityManager>();
  const userRepository = mock<UserRepository>();
  const pointHistoryRepository = mock<PointHistoryRepository>();
  const passwordHasher = mock<PasswordHasher>();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: DataSource, useValue: ds },
        { provide: UserRepository, useValue: userRepository },
        { provide: PointHistoryRepository, useValue: pointHistoryRepository },
        { provide: PasswordHasher, useValue: passwordHasher },
      ],
    }).compile();

    service = module.get(UserService);
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
    mockReset(passwordHasher);
  });

  describe('registerUser', () => {
    const userDto: UserDto = { id: 'testuser', password: 'password123' };
    const hashedPassword = 'hashed_password';

    it('새로운 사용자를 성공적으로 등록합니다', async () => {
      userRepository.existBy.mockResolvedValue(false);
      passwordHasher.hashOriginalPassword.mockResolvedValue(hashedPassword);
      userRepository.insert.mockResolvedValue(undefined);

      await service.registerUser(userDto);

      expect(ds.transaction).toHaveBeenCalledTimes(1);
      expect(userRepository.existBy).toHaveBeenCalledWith(em, userDto.id);
      expect(passwordHasher.hashOriginalPassword).toHaveBeenCalledWith(
        userDto.password,
      );
      expect(userRepository.insert).toHaveBeenCalledWith(em, {
        id: userDto.id,
        password: hashedPassword,
      });
    });

    it('이미 존재하는 ID일 경우 ConflictException을 던집니다', async () => {
      userRepository.existBy.mockResolvedValue(true);

      await expect(service.registerUser(userDto)).rejects.toThrow(
        ConflictException,
      );
      expect(passwordHasher.hashOriginalPassword).not.toHaveBeenCalled();
      expect(userRepository.insert).not.toHaveBeenCalled();
    });

    it('데이터베이스 오류 발생 시 InternalServerErrorException을 던집니다', async () => {
      userRepository.existBy.mockResolvedValue(false);
      passwordHasher.hashOriginalPassword.mockResolvedValue(hashedPassword);
      userRepository.insert.mockRejectedValue(new Error('DB Error'));

      await expect(service.registerUser(userDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('loginUser', () => {
    const userDto: UserDto = { id: 'testuser', password: 'password123' };
    const hashedPassword = 'hashed_password';
    let session: UserSession;

    beforeEach(() => {
      session = {} as UserSession;
    });

    it('로그인에 성공하고 세션에 사용자 정보를 저장합니다', async () => {
      userRepository.existBy.mockResolvedValue(true);
      userRepository.findPasswordById.mockResolvedValue(hashedPassword);
      passwordHasher.compare.mockResolvedValue(true);

      await service.loginUser(userDto, session);

      expect(ds.transaction).toHaveBeenCalledTimes(1);
      expect(userRepository.existBy).toHaveBeenCalledWith(em, userDto.id);
      expect(userRepository.findPasswordById).toHaveBeenCalledWith(
        em,
        userDto.id,
      );
      expect(passwordHasher.compare).toHaveBeenCalledWith(
        userDto.password,
        hashedPassword,
      );
      // 세션 수정 확인
      expect(session.userId).toBe(userDto.id);
      expect(session.loginTime).toBeDefined();
    });

    it('존재하지 않는 사용자 ID일 경우 UnauthorizedException을 던집니다', async () => {
      userRepository.existBy.mockResolvedValue(false);

      await expect(service.loginUser(userDto, session)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(userRepository.findPasswordById).not.toHaveBeenCalled();
      expect(passwordHasher.compare).not.toHaveBeenCalled();
      expect(session.userId).toBeUndefined();
    });

    it('비밀번호가 일치하지 않을 경우 UnauthorizedException을 던집니다', async () => {
      userRepository.existBy.mockResolvedValue(true);
      userRepository.findPasswordById.mockResolvedValue(hashedPassword);
      passwordHasher.compare.mockResolvedValue(false);

      await expect(service.loginUser(userDto, session)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(session.userId).toBeUndefined();
    });

    it('데이터베이스 오류 발생 시 InternalServerErrorException을 던집니다', async () => {
      userRepository.existBy.mockRejectedValue(new Error('DB Error'));

      await expect(service.loginUser(userDto, session)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(session.userId).toBeUndefined();
    });
  });
});
