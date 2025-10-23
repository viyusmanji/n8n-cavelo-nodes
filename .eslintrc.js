module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:n8n-nodes-base/nodes',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'n8n-nodes-base/node-dirname-against-convention': 'error',
    'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'error',
    'n8n-nodes-base/node-class-description-outputs-wrong': 'error',
    'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'error',
    'n8n-nodes-base/node-class-description-icon-not-svg': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  overrides: [
    {
      files: ['credentials/**/*.ts'],
      rules: {
        'n8n-nodes-base/cred-class-field-display-name-missing-api': 'error',
        'n8n-nodes-base/cred-class-field-display-name-missing-oauth': 'error',
        'n8n-nodes-base/cred-class-name-unsuffixed': 'error',
        'n8n-nodes-base/cred-class-field-name-unsuffixed': 'error',
      },
    },
  ],
};
