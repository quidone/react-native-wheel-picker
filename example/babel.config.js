const path = require('path');
const pak = require('../package.json');
const localPkgs = require('../local-namespace-config');

module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            // For development, we want to alias the library to the source
            [pak.name]: path.join(__dirname, '..', pak.source),
            ...Object.entries(localPkgs).reduce((r, [name, ph]) => {
              r[name] = path.join(__dirname, '..', ph);
              return r;
            }, {}),
          },
        },
      ],
    ],
  };
};
