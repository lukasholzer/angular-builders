module.exports = {
  verbose: true,
  testEnvironment: "node",
  testPathIgnorePatterns: ["lib/", "node_modules", "fixtures"],
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testRegex: "(/(tests|src)/.*.(test|e2e)).ts$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  collectCoverage: true
};
