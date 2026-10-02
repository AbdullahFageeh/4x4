const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// The Expo web dev server forces the `hermes-stable` transform, whose
// module interop breaks ESM default imports on web (e.g. @react-aria
// default import arrives as a string → "o is not a function"). The
// classic `stable` (Babel/CJS) transform has correct web interop, so use
// it for web. Value must be a serializable string. Native builds are
// unaffected (they never use the web bundle path).
config.transformer = {
  ...config.transformer,
  unstable_transformProfile: 'stable',
};

config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    // On Web, react-native-maps pulls native-only deep imports from
    // react-native/Libraries/* that don't exist in the published web
    // package. Swap the whole module for a lightweight web stub so the
    // app (and any screen touching a map) renders in the browser.
    // Native (ios/android) resolution is unchanged.
    if (platform === 'web' && moduleName === 'react-native-maps') {
      return context.resolveRequest(
        context,
        path.resolve(__dirname, 'src/webStubs/reactNativeMapsWebStub.tsx'),
        platform
      );
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;