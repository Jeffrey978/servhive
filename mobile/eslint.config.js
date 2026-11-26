// Expo's recommended lint rules for the app (the website at the repo root has its own config).
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/*', 'scripts/*'],
  },
  {
    rules: {
      // An HTML-entity rule for the web: apostrophes and quotes in React Native <Text> render as typed.
      'react/no-unescaped-entities': 'off',
    },
  },
]);
