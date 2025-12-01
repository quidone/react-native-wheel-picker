const path = require('path');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
        alias: {
          'react-native-wheel-picker-plus': path.resolve(__dirname, '../src/index'),
          '@implementation/base': path.resolve(__dirname, '../src/base/index'),
          '@implementation/picker-control': path.resolve(__dirname, '../src/picker-control/index'),
          '@implementation/virtualized': path.resolve(__dirname, '../src/hoc/virtualized/index'),
          '@utils/react': path.resolve(__dirname, '../src/utils/react/index'),
          '@utils/math': path.resolve(__dirname, '../src/utils/math/index'),
          '@utils/debounce': path.resolve(__dirname, '../src/utils/debounce/index'),
          '@utils/scrolling': path.resolve(__dirname, '../src/utils/scrolling/index'),
          '@utils/nanoevents': path.resolve(__dirname, '../src/utils/nanoevents/index'),
        },
      },
    ],
  ],
};
