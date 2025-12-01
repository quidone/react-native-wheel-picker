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
const exampleNodeModules = path.resolve(__dirname, 'node_modules');
const rootNodeModules = path.resolve(rootPath, 'node_modules');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  watchFolders: [rootPath],
  resolver: {
    ...defaultConfig.resolver,
    nodeModulesPaths: [exampleNodeModules],
    blockList: [
      // Block React and React Native from root node_modules
      new RegExp(`${rootNodeModules}/react/.*`),
      new RegExp(`${rootNodeModules}/react-native/.*`),
    ],
    extraNodeModules: {
      ...defaultConfig.resolver.extraNodeModules,
      'react-native-wheel-picker-plus': srcPath,
      '@implementation/base': path.resolve(srcPath, 'base/index'),
      '@implementation/picker-control': path.resolve(srcPath, 'picker-control/index'),
      '@implementation/virtualized': path.resolve(srcPath, 'hoc/virtualized/index'),
      '@utils/react': path.resolve(srcPath, 'utils/react/index'),
      '@utils/math': path.resolve(srcPath, 'utils/math/index'),
      '@utils/debounce': path.resolve(srcPath, 'utils/debounce/index'),
      '@utils/scrolling': path.resolve(srcPath, 'utils/scrolling/index'),
      '@utils/nanoevents': path.resolve(srcPath, 'utils/nanoevents/index'),
      // Force React and React Native to resolve from example's node_modules only
      'react': path.resolve(exampleNodeModules, 'react'),
      'react-native': path.resolve(exampleNodeModules, 'react-native'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
