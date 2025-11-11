import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config([
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-call': 'off',
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: 'multiline-block-like', next: 'const' },
        { blankLine: 'always', prev: 'const', next: 'multiline-block-like' },
        {
          blankLine: 'always',
          prev: 'multiline-block-like',
          next: 'multiline-block-like',
        },

        { blankLine: 'always', prev: 'class', next: 'multiline-block-like' },
        { blankLine: 'always', prev: 'multiline-block-like', next: 'class' },
        { blankLine: 'always', prev: 'class', next: 'class' },

        { blankLine: 'always', prev: 'class', next: 'const' },
        { blankLine: 'always', prev: 'const', next: 'class' },

        { blankLine: 'always', prev: 'class', next: 'multiline-block-like' },
        { blankLine: 'always', prev: 'multiline-block-like', next: 'class' },
        { blankLine: 'always', prev: 'class', next: 'class' },
      ],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  // 엔티티, DTO
  {
    files: ['**/*.entity.ts', '**/*.dto.ts'],
    rules: {
      'lines-between-class-members': [
        'warn',
        {
          enforce: [{ blankLine: 'always', prev: '*', next: '*' }],
        },
        { exceptAfterSingleLine: false },
      ],
    },
  },
  // 테스트 코드
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
    },
  },
]);
