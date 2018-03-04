Feature: User

  I want to login with a user

  Scenario: Register User
    Given I open panel
    Then Generate new email
    Then Set "email" by email
    Then Press "مرحله بعد"
    Then Set "firstName" id as "Test"
    Then Set "lastName" id as "Test user"
    Then Set "password" id as "123456123"
    Then Set ".phone-input .phone-text-field input" as "09122718412"
    Then Press "مرحله بعد"
    Given I open mailhog
    Then I click on ".messages > :nth-child(1)"
    Then I open verification link
    Then I see "dashboard" in url

  Scenario: User Login
    Given I open panel
    Then Set "email" id as "e.hosseini@clickyab.com"
    Then Press "مرحله بعد"
    Then Set "password" id as "123456123"
    Then Press "ورود"
    Then I see "dashboard" in url
