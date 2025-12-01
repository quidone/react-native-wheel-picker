const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const rootPath = path.resolve(__dirname, '..');
const srcPath = path.resolve(__dirname, '../src');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  watchFolders: [rootPath],
  resolver: {
    ...defaultConfig.resolver,
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(rootPath, 'node_modules'),
    ],
    extraNodeModules: {
      ...defaultConfig.resolver.extraNodeModules,
      '@quidone/react-native-wheel-picker': srcPath,
      '@implementation/base': path.resolve(srcPath, 'base/index'),
      '@implementation/picker-control': path.resolve(srcPath, 'picker-control/index'),
      '@implementation/virtualized': path.resolve(srcPath, 'hoc/virtualized/index'),
      '@utils/react': path.resolve(srcPath, 'utils/react/index'),
      '@utils/math': path.resolve(srcPath, 'utils/math/index'),
      '@utils/debounce': path.resolve(srcPath, 'utils/debounce/index'),
      '@utils/scrolling': path.resolve(srcPath, 'utils/scrolling/index'),
      '@utils/nanoevents': path.resolve(srcPath, 'utils/nanoevents/index'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
