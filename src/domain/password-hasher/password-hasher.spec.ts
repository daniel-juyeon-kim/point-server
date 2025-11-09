import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import { PasswordHasher } from './password-hasher';

jest.mock('bcrypt');

describe('PasswordHasher', () => {
  let passwordHasher: PasswordHasher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordHasher],
    }).compile();

    passwordHasher = module.get<PasswordHasher>(PasswordHasher);
    jest.clearAllMocks();
  });

  afterEach(() => {
    bcrypt.hash = jest.fn();
  });

  describe('hashOriginalPassword', () => {
    it('bcrypt.hash를 올바른 비밀번호와 라운드 값으로 호출하고 결과를 반환합니다', async () => {
      const originalPassword = 'my-plain-password';
      const rounds = 12;
      const expectedHashedPassword = 'a-mocked-hash-string';

      (bcrypt.hash as jest.Mock).mockResolvedValue(expectedHashedPassword);

      const result =
        await passwordHasher.hashOriginalPassword(originalPassword);

      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith(originalPassword, rounds);
      expect(result).toBe(expectedHashedPassword);
    });
  });
});
