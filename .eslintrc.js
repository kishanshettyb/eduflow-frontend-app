module.exports = {
  extends: ['next', 'prettier', 'next/core-web-vitals'],
  plugins: ['react', 'react-hooks', 'prettier'],
  rules: {
    // quotes: ['warn', 'single'],
    // semi: ['warn', 'always'],
    // 'no-unused-vars': [
    //   'warn',
    //   {
    //     args: 'after-used',
    //     caughtErrors: 'none',
    //     ignoreRestSiblings: true,
    //     vars: 'all'
    //   }
    // ],
    // 'prefer-const': 'warn',
    // 'react-hooks/exhaustive-deps': 'warn'
    // Disabling all ESLint rules
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-debugger': 'off'
  }
};
