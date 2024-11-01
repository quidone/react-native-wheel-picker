const path = require('path');
const localPkgs = require('./local-namespace-config');

module.exports = {
  preset: 'react-native',
  modulePathIgnorePatterns: [
    '<rootDir>/example/node_modules',
    '<rootDir>/dest/',
  ],
  moduleNameMapper: Object.entries(localPkgs).reduce((r, [name, ph]) => {
    r[name] = path.resolve(__dirname, ph);
    return r;
  }, {}),
};
