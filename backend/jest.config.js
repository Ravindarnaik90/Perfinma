module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./__tests__/setup.js'],
  // Ignore the setup file as a test
  testPathIgnorePatterns: ['/__tests__/setup.js'],
};