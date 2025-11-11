import { Test, TestingModule } from '@nestjs/testing';
import { PasswordHasher } from './password-hasher';

describe('PasswordHasher (Real)', () => {
  let passwordHasher: PasswordHasher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordHasher],
    }).compile();

    passwordHasher = module.get<PasswordHasher>(PasswordHasher);
  });

  describe('hashOriginalPassword', () => {
    it('원본 비밀번호를 해시화된 문자열로 변환합니다', async () => {
      const originalPassword = 'my-plain-password';

      const hashedPassword =
        await passwordHasher.hashOriginalPassword(originalPassword);

      // 생성된 해시가 유효한지 확인
      await expect(
        passwordHasher.compare(originalPassword, hashedPassword),
      ).resolves.toBe(true);
    });
  });

  describe('compare', () => {
    const originalPassword = 'my-plain-password';
    const wrongPassword = 'another-password';
    let hashedPassword: string;

    beforeEach(async () => {
      hashedPassword =
        await passwordHasher.hashOriginalPassword(originalPassword);
    });

    it('올바른 비밀번호와 비교 시 true를 반환합니다', async () => {
      await expect(
        passwordHasher.compare(originalPassword, hashedPassword),
      ).resolves.toBe(true);
    });

    it('잘못된 비밀번호와 비교 시 false를 반환합니다', async () => {
      await expect(
        passwordHasher.compare(wrongPassword, hashedPassword),
      ).resolves.toBe(false);
    });
  });
});
