process.chdir(__dirname);

module.exports = {
  root: true,
  parserOptions: {
    allowImportExportEverywhere: true,
    codeFrame: false
  },
  extends: [
    'drupal-bundle',
  ],
};
