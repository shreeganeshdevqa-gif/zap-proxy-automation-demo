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

    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true,
    screenshotsFolder: "cypress/screenshots",
    screenshotOnRunFailure: true,
    video: false,
    env: {
  cucumber: {
    json: {
      enabled: true,
      output: "reports/cucumber/cucumber.json"
    }
  }
},


    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      // ensure baseUrl is injected everywhere
      config.baseUrl = BASE_URL;

      return config;
    },
  },
});
