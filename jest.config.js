const dotenv = require("dotenv");

dotenv.config({
  path: ".env.development",
});

const nextJest = require("next/jest");

const createNextJestConfig = nextJest({
  dir: ".",
});
const jestConfig = createNextJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
});

module.exports = jestConfig;
