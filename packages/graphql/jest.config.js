const pkg = require('./package.json');

module.exports = {
  name: pkg.name,
  preset: '../../jest.config.js',
  displayName: `${pkg.name} – v${pkg.version}`,
};