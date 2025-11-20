module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'eslint:recommended',
    '@vitejs/plugin-react'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'warn'
  }
}