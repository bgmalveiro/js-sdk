module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
    moduleFileExtensions: [
      "js",
      "ts"
    ],
    moduleNameMapper: {
      "^src/(.*)$": "<rootDir>/src/$1",
      "^test/(.*)$": "<rootDir>/test/$1",
      "jsonwebtoken": "<rootDir>/test/__mocks__/jsonwebtoken.ts"
    },
    transform: {
      "^.+\\.ts?$": "ts-jest"
    },
    testMatch: [
      "**/*.(test|spec).(ts)"
    ],
    coveragePathIgnorePatterns: [
      "/node_modules/"
    ],
    globals: {
      "ts-jest": {
        babelConfig: false,
        tsConfig: "tsconfig.json"
      }
    },
    collectCoverage: true,
    coverageReporters: [
      "json",
      "lcov",
      "text",
      "text-summary"
    ],
    collectCoverageFrom: [
      "src/**/*.{ts,js}",
      "!src/**/*.d.ts",
      "!src/**/index.ts"
    ]
}
    