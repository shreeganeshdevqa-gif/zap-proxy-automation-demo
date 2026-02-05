Feature: OrangeHRM Login

  Scenario Outline: Valid user logs into OrangeHRM
    Given I open the OrangeHRM login page
    When I login with username "<username>" and password "<password>"
    Then I should see the dashboard page

    Examples:
      | username | password |
      | Admin    | admin123 |
