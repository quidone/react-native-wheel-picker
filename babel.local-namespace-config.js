const localPkgs = require('./local-namespace-config');

module.exports = {
  plugins: [
    ['@babel/plugin-syntax-typescript', {isTSX: true}],
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          ...Object.entries(localPkgs).reduce((r, [name, ph]) => {
            r[name] = ph;
            return r;
          }, {}),
        },
      },
    ],
  ],
};
