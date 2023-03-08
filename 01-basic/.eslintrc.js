module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  rules: {
    semi: 'error',
    'no-console': 'off',
    'linebreak-style': 'off',
    'eol-last': 'off',
    'no-unused-vars': 'off',
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    // "indent":["error",2]
  },
  env: {
    browser: true,
    node: true,
  },
};
