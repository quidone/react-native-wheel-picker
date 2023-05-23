const prettierConfig = require('./.prettierrc.js');

module.exports = {
  root: true,
  extends: ['@react-native-community', 'prettier'],
  rules: {
    'prettier/prettier': ['error', prettierConfig],
  },
  ignorePatterns: ['node_modules/', 'dest/'],
};
