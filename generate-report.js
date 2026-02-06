const fs = require("fs");
const path = require("path");
const reporter = require("multiple-cucumber-html-reporter");

const jsonDir = path.join(__dirname, "cypress/reports/json");
const reportDir = path.join(
  __dirname,
  "security-and-test-reports/cucumber"
);

// Safety check
if (!fs.existsSync(jsonDir) || fs.readdirSync(jsonDir).length === 0) {
  console.error("❌ No Cucumber JSON files found. HTML report not generated.");
  process.exit(0);
}

reporter.generate({
  jsonDir: jsonDir,
  reportPath: reportDir,
  reportName: "Cypress Cucumber HTML Report",
  pageTitle: "Automation Test Results",
  displayDuration: true,
  metadata: {
    browser: {
      name: "chrome",
      version: "latest",
    },
    device: "CI Runner",
    platform: {
      name: "GitHub Actions",
    },
  },
});

console.log("✅ Cucumber HTML report generated successfully");
