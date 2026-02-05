const reporter = require("cucumber-html-reporter");

const options = {
  theme: "bootstrap",
  jsonFile: "cypress/cucumber-json/cucumber.json",
  output: "reports/cucumber-html-report/report.html",
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false
};

reporter.generate(options);
