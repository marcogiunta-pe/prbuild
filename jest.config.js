/** @type {import('jest').Config} */
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const config = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: ['lib/**/*.ts', 'components/**/*.tsx'],
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
};

module.exports = createJestConfig(config);
