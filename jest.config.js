export default {
    transform: {
      "^.+\\.mjs$": "babel-jest",
      "^.+\\.js$": "babel-jest"
    },
    moduleNameMapper: {
      "^(\\.{1,2}/.*)\\.js$": "$1"
    },
    testEnvironment: 'node'
  };
  