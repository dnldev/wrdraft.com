/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
  preset: "ts-jest",
  testEnvironment: "node",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^lodash-es$": "lodash",
  },

  transformIgnorePatterns: [String.raw`/node_modules/(?!lodash-es).+\.js$`],

  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  coverageReporters: ["json", "lcov", "text", "clover"],
  watchPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/coverage/",
  ],
};

export default jestConfig;
