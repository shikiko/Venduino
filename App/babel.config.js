const path = require('path');

// FIXME: Resolve `transform[stderr]: Could not resolve` command-line warnings.
// FIXME: Reproducible when starting with clearing cache (npm start -- -c)
//
// TODO: Framework path aliasing even not needed here. Replace?
// TODO: Replace nested package.json-s with aliases

const KITTEN_PATH = path.resolve(
  __dirname,
  './node_modules/react-native-ui-kitten',
);

const moduleResolverConfig = {
  root: path.resolve('./'),
  alias: {
    '@kitten/theme': path.resolve(KITTEN_PATH, 'theme'),
    '@kitten/ui': path.resolve(KITTEN_PATH, 'ui'),
  },
};

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [require.resolve('babel-plugin-module-resolver'), moduleResolverConfig],
  ],
};
