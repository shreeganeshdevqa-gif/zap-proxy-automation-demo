const report = require("multiple-cucumber-html-reporter");

report.generate({
  jsonDir: "cypress/cucumber-json",
  reportPath: "reports/cucumber",
  reportName: "Cypress Cucumber Report",
  pageTitle: "Cypress BDD Test Results",
  displayDuration: true,
  metadata: {
    browser: {
      name: "chrome",
      version: "latest",
    },
    device: "GitHub Actions",
    platform: {
      name: "ubuntu",
    },
  },
});
