import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  {
    files: ['src/**/*.js', 'src/**/*.jsx'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^(React|[A-Z])',
          argsIgnorePattern: '^_',
        },
      ],
      'react/jsx-pascal-case': ['warn', { allowAllCaps: true }],
      eqeqeq: ['warn', 'always'],
      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
