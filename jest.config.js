/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["./app/src/test/setupTests.js"],
  roots: ["app/src"],
  moduleDirectories: ["node_modules", "app/src"]
};
