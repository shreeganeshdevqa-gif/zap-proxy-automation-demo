const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");

require("dotenv").config();

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL,
    specPattern: "cypress/e2e/features/**/*.feature",

    async setupNodeEvents(on, config) {
      // ✅ Cucumber plugin
      await addCucumberPreprocessorPlugin(on, config);

      // ✅ Esbuild bundler
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      // ✅ Firefox-only logic




      return config;
    },
  },
});
