import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I open the OrangeHRM login page", () => {
  cy.visit("/web/index.php/auth/login");
  cy.location("pathname", { timeout: 20000 }).should("eq", "/web/index.php/auth/login");

});

When("I login with username {string} and password {string}", (username, password) => {
  cy.get('input[name="username"]', { timeout: 20000 })
  .should("be.visible")
  .type(username);
  cy.get('input[name="password"]', { timeout: 20000 })
  .should("be.visible")
  .type(password);
  cy.get('button[type="submit"]').click();
});

Then("I should see the dashboard page", () => {
  cy.url().should("include", "/dashboard");
});
