#!/usr/bin/env bash

set -e

PROJECT_NAME="zap-proxy-automation-demo"

echo "Creating Cypress BDD project structure..."

# Root
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# Cypress directories
mkdir -p cypress/e2e/features
mkdir -p cypress/support/step_definitions
mkdir -p cypress/fixtures

# Reports
mkdir -p reports/cucumber-html-report
mkdir -p cypress/cucumber-json

# =========================
# .env
# =========================
cat <<EOF > .env
CYPRESS_BASE_URL=https://opensource-demo.orangehrmlive.com
EOF

# =========================
# package.json
# =========================
cat <<EOF > package.json
{
  "name": "cypress-bdd-proxy",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test:chrome": "cypress run --browser chrome",
    "test:firefox": "cypress run --browser firefox",
    "test:firefox:proxy": "cypress run --browser firefox --env proxy=true,proxyHost=localhost,proxyPort=8080",
    "report": "node generate-report.js"
  },
  "devDependencies": {
    "cypress": "^13.6.0",
    "@badeball/cypress-cucumber-preprocessor": "^21.0.2",
    "@bahmutov/cypress-esbuild-preprocessor": "^2.2.0",
    "cucumber-html-reporter": "^5.5.0",
    "dotenv": "^16.4.0"
  }
}
EOF

# =========================
# cypress.config.js
# =========================
cat <<EOF > cypress.config.js
const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");

require("dotenv").config();

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL,
    specPattern: "cypress/e2e/features/**/*.feature",

    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      on("before:browser:launch", (browser, launchOptions) => {
        const proxyEnabled = config.env.proxy === true || config.env.proxy === "true";

        if (proxyEnabled && browser.family === "firefox") {
          const host = config.env.proxyHost || "localhost";
          const port = Number(config.env.proxyPort || 8080);

          launchOptions.preferences["network.proxy.type"] = 1;
          launchOptions.preferences["network.proxy.http"] = host;
          launchOptions.preferences["network.proxy.http_port"] = port;
          launchOptions.preferences["network.proxy.ssl"] = host;
          launchOptions.preferences["network.proxy.ssl_port"] = port;
          launchOptions.preferences["network.proxy.no_proxies_on"] = "";
          launchOptions.preferences["security.enterprise_roots.enabled"] = true;

          console.log("Firefox proxy enabled:", host + ":" + port);
        }

        return launchOptions;
      });

      return config;
    },
  },
});
EOF

# =========================
# Feature file
# =========================
cat <<EOF > cypress/e2e/features/login.feature
Feature: OrangeHRM Login

  Scenario Outline: Valid user logs into OrangeHRM
    Given I open the OrangeHRM login page
    When I login with username "<username>" and password "<password>"
    Then I should see the dashboard page

    Examples:
      | username | password |
      | Admin    | admin123 |
EOF

# =========================
# Step definitions
# =========================
cat <<EOF > cypress/support/step_definitions/login.steps.js
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I open the OrangeHRM login page", () => {
  cy.visit("/web/index.php/auth/login");
});

When("I login with username {string} and password {string}", (username, password) => {
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Then("I should see the dashboard page", () => {
  cy.url().should("include", "/dashboard");
});
EOF

# =========================
# support/e2e.js
# =========================
cat <<EOF > cypress/support/e2e.js
// Cypress support file
EOF

# =========================
# fixtures/users.json
# =========================
cat <<EOF > cypress/fixtures/users.json
{
  "admin": {
    "username": "Admin",
    "password": "admin123"
  }
}
EOF

# =========================
# Cucumber HTML report generator
# =========================
cat <<EOF > generate-report.js
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
EOF

echo "✅ Cypress BDD project created successfully!"
