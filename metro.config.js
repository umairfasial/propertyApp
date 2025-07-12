const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'), // Exclude .svg from assetExts
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'], // Add .svg to sourceExts
  },
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'), // Use SVG transformer
  },
};

module.exports = mergeConfig(defaultConfig, config);
