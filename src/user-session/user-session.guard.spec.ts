import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UserRepository } from 'src/database/repository/user.repository';
import { PartialUserSession } from 'src/domain/user-session.interface';
import { DataSource } from 'typeorm';
import { UserSessionGuard } from './user-session.guard';

const createMockExecutionContext = (session: PartialUserSession) => {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        session,
      }),
    }),
  } as ExecutionContext;
};

describe('UserSessionGuard', () => {
  let guard: UserSessionGuard;
  let mockUserRepository: DeepMockProxy<UserRepository>;
  let mockDataSource: DeepMockProxy<DataSource>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserSessionGuard,
        { provide: UserRepository, useValue: mockDeep<UserRepository>() },
        { provide: DataSource, useValue: mockDeep<DataSource>() },
      ],
    }).compile();

    guard = module.get(UserSessionGuard);
    mockUserRepository = module.get(UserRepository);
    mockDataSource = module.get(DataSource);
  });

  it('세션에 userId가 있고 DB에 사용자가 존재하면 true를 반환해야 함', async () => {
    const session = { userId: 'test-user' } as PartialUserSession;
    const context = createMockExecutionContext(session);
    mockUserRepository.existBy.mockResolvedValue(true);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockUserRepository.existBy).toHaveBeenCalledWith(
      mockDataSource.manager,
      'test-user',
    );
  });

  it('세션에 userId가 없으면 false를 반환해야 함', async () => {
    const session = {} as PartialUserSession;
    const context = createMockExecutionContext(session);

    const result = await guard.canActivate(context);

    expect(result).toBe(false);
    expect(mockUserRepository.existBy).not.toHaveBeenCalled();
  });

  it('세션에 userId가 있지만 DB에 사용자가 없으면 false를 반환해야 함', async () => {
    const session = { userId: 'non-existent-user' } as PartialUserSession;
    const context = createMockExecutionContext(session);
    mockUserRepository.existBy.mockResolvedValue(false);

    const result = await guard.canActivate(context);

    expect(result).toBe(false);
    expect(mockUserRepository.existBy).toHaveBeenCalledWith(
      mockDataSource.manager,
      'non-existent-user',
    );
  });
});
