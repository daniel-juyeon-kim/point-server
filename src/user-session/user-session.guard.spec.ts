import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SessionData, Store } from 'express-session';
import { MockProxy, mock } from 'jest-mock-extended';
import { UserSessionGuard } from './user-session.guard';

const createMockExecutionContext = (
  sessionStore: MockProxy<Store>,
  sessionId: string,
) => {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        session: { id: sessionId },
        sessionStore: sessionStore,
      }),
    }),
  } as ExecutionContext;
};

describe('UserSessionGuard', () => {
  let guard: UserSessionGuard;
  let mockSessionStore: MockProxy<Store>;
  const sessionId = 'test-session-id';

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserSessionGuard],
    }).compile();

    guard = module.get(UserSessionGuard);
    mockSessionStore = mock<Store>();
  });

  it('세션이 존재할 경우 true를 반환해야 함', async () => {
    mockSessionStore.get.mockImplementation((sid, callback) => {
      callback(null, { cookie: {} } as SessionData);
    });
    const context = createMockExecutionContext(mockSessionStore, sessionId);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('세션이 존재하지 않을 경우 false를 반환해야 함', async () => {
    mockSessionStore.get.mockImplementation((sid, callback) => {
      callback(null, null);
    });
    const context = createMockExecutionContext(mockSessionStore, sessionId);

    const result = await guard.canActivate(context);

    expect(result).toBe(false);
  });

  it('세션 저장소에서 에러가 발생할 경우 false를 반환해야 함', async () => {
    mockSessionStore.get.mockImplementation((sid, callback) => {
      callback(new Error('Store error'), null);
    });
    const context = createMockExecutionContext(mockSessionStore, sessionId);

    const result = await guard.canActivate(context);

    expect(result).toBe(false);
  });
});
