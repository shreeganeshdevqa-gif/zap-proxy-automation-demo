const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");

require("dotenv").config();

const BASE_URL =
  process.env.CYPRESS_BASE_URL ||
  "https://opensource-demo.orangehrmlive.com";

console.log("✅ Cypress baseUrl:", BASE_URL);

module.exports = defineConfig({
  e2e: {
    baseUrl: BASE_URL,
    specPattern: "cypress/e2e/features/**/*.feature",

    screenshotsFolder: "cypress/screenshots",
    screenshotOnRunFailure: true,
    video: false,

    async setupNodeEvents(on, config) {
      // ✅ REQUIRED for Cucumber
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      return config;
    },
  },

  env: {
    cucumber: {
      json: {
        enabled: true,
        output: "cypress/reports/json/cucumber-report.json",
      },
    },
  },
});
