module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: [
    'text',
    'lcov',
  ],
  moduleFileExtensions: [
    'js',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
};
