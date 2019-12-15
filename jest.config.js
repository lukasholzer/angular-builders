module.exports = {
  verbose: true,
  testPathIgnorePatterns: ['lib/', 'node_modules', 'fixtures'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testRegex: "(/(tests|src)/.*.(test|spec|e2e)).ts$",
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverage: true,
  projects: [
    '<rootDir>/packages/*/jest.config.js'
  ],
  coverageDirectory: "<rootDir>/coverage/"
};