module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|expo|@expo)/)',
  ],
};
