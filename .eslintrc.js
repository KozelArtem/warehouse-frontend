module.exports = {
  root: true,

  env: {
    node: true,
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-param-reassign': ['warn', { props: false }],
    quotes: [2, 'single', { avoidEscape: true }],
    'import/prefer-default-export': 'off',
  },

  parserOptions: {
    parser: 'babel-eslint',
  },

  extends: ['plugin:vue/essential', '@vue/airbnb'],
};
