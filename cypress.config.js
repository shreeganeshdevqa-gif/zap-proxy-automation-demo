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
    // ✅ fallback added (CRITICAL)
    baseUrl:
      process.env.CYPRESS_BASE_URL ||
      "https://opensource-demo.orangehrmlive.com",

    specPattern: "cypress/e2e/features/**/*.feature",
    supportFile: "cypress/support/e2e.js",

    async setupNodeEvents(on, config) {
      // Cucumber plugin
      await addCucumberPreprocessorPlugin(on, config);

      // Esbuild bundler
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      // 🔍 Debug proof (shows in CI logs)
      console.log("✅ Cypress baseUrl:", config.baseUrl);

      return config;
    },
  },
});
