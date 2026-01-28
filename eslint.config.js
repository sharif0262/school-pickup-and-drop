// .eslintrc.js
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import pluginRouter from '@tanstack/eslint-plugin-router';
import pluginTailwindcss from 'eslint-plugin-tailwindcss';
import globals from 'globals';
import noBigIntInQueryKeys from './eslint-rules/no-bigint-in-query-keys.js';
import requireInternetIdentityProvider from './eslint-rules/require-internet-identity-provider.js';

export default [
  // Ignore compiled, config, and backend files
  {
    ignores: [
      '**/backend.ts',
      '**/backend.d.ts',
      'dist/**',
      'node_modules/**',
      'build/**',
      '*.config.js',
      'eslint-rules/**'
    ]
  },

  // Recommended configs from plugins
  ...pluginRouter.configs['flat/recommended'],
  ...pluginTailwindcss.configs['flat/recommended'],

  // Main config for TS/React
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: new URL('.', import.meta.url).pathname,
        ecmaFeatures: { jsx: true }
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
      'react-hooks': reactHooks,
      tailwindcss: pluginTailwindcss,
      custom: {
        rules: {
          'no-bigint-in-query-keys': noBigIntInQueryKeys,
          'require-internet-identity-provider': requireInternetIdentityProvider
        }
      }
    },
    rules: {
      // TypeScript recommended rules
      ...typescript.configs.recommended.rules,

      // React hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',

      // Relaxed TypeScript rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['off', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',

      // General JS rules
      'no-console': 'off',
      'prefer-const': 'off',
      'no-useless-escape': 'off',

      // Tailwind rules (mostly relaxed)
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/classnames-order': 'off',
      'tailwindcss/no-unnecessary-arbitrary-value': 'off',
      'tailwindcss/enforces-shorthand': 'off',

      // Custom project rules
      'custom/no-bigint-in-query-keys': 'error',
      'custom/require-internet-identity-provider': 'error'
    },
    settings: {
      tailwindcss: {
        callees: ['cn', 'cva'],
        config: './tailwind.config.js'
      }
    }
  }
];

