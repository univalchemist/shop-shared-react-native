module.exports = api => {
  api.cache(true);

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@routes': ['./src/routes.js'],
            '@theme': ['./src/theme.js'],
            '@navigations': ['./src/navigations'],
            '@middlewares': ['./src/middlewares'],
            '@components': ['./src/components'],
            '@containers': ['./src/containers'],
            '@services': ['./src/services'],
            '@images': ['./src/images'],
            '@config': ['./src/config'],
            '@utils': ['./src/utils'],
            '@store': ['./src/store'],
            '@testUtils': ['./src/testUtils'],
            '@shops': ['./src/components/shops/src'],
            '@screens': ['./src/screens'],
            '@wrappers': ['./src/wrappers'],
            '@heal': ['./src/components/heal'],
          },
        },
      ],
    ],
  };
};
