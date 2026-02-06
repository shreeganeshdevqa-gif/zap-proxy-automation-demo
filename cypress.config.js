const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    specPattern: "cypress/e2e/features/**/*.feature",

    screenshotsFolder: "cypress/screenshots",
    screenshotOnRunFailure: true,
    video: false,

    async setupNodeEvents(on, config) {
      // REQUIRED
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

  // 🔥 THIS IS THE MISSING PIECE
  reporter: "cucumber-json",

  reporterOptions: {
    outputFile: "cypress/reports/json/cucumber-report.json",
  },
});
