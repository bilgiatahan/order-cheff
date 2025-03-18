module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'prettier',
    'import',
    'unused-imports'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'import/order': [
      'error',
      {
        'groups': ['builtin', 'external', 'internal', ['parent', 'sibling']],
        'newlines-between': 'always',
        'alphabetize': { order: 'asc' }
      }
    ],
    'unused-imports/no-unused-imports': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'max-len': ['error', { code: 100, ignoreComments: true }],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  ignorePatterns: [
    // Build outputs
    '**/dist',
    '**/build',
    '**/out',
    '**/.next',
    '/.next',
    '/.next/*',
    '/.next/**/*',

    // Dependencies
    '**/node_modules',
    'node_modules',

    // Config files
    '*.config.js',
    '*.config.ts',
    '*.config.mjs',
    '*.config.cjs',
    '.eslintrc.js',
    'next.config.*',
    'postcss.config.*',
    'tailwind.config.*',

    // Environment files
    '.env',
    '.env.*',

    // Type declaration files
    '**/*.d.ts',
    '**/next-env.d.ts',

    // Public and assets
    'public',
    'public/*',

    // Documentation
    '**/*.md',
    '**/docs',

    // IDE and editor
    '.vscode',
    '.idea',
    '*.code-workspace',

    // Cache and temp
    '.eslintcache',
    '**/.npm',
    '**/.temp',
    '**/.tmp',

    // Test files
    '**/__tests__',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/jest.setup.js',

    // Generated
    '**/*.generated.*'
  ]
}; 