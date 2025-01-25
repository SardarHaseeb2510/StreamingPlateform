module.exports = {
    testEnvironment: 'node',
    coverageDirectory: './coverage',
    collectCoverage: true,
    setupFilesAfterEnv: ["<rootDir>/_tests_/setup.js"],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  };