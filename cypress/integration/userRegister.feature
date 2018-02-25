Feature: User

  I want to login with a user

  Scenario: User Login
    Given I open panel
    Then Set "email" id as "e.hosseini@clickyab.com"
    Then Press "مرحله بعد"
    Then Set "password" id as "123456123"
    Then Press "ورود"
    Then I see "dashboard" in url

