# features/homePage.feature
Feature: HomePage feature
  As a user
  I open homePage
  So that I can see infoData, trendData and articleData.

  Scenario: Reading documentation
    Given I am on the Cucumber.js GitHub repository
    When I click on "CLI"
    Then I should see "Running specific features"

  Scenario: Show infoData
    Given I am on "HomePage"
    Then I should see "2016" in "infoData"

#  Scenario: Show trendData
#    Given I am on "HomePage"
#    Then I should see "2016" in "trendData"
#
#  Scenario: Show articleData
#    Given I am on "HomePage"
#    Then I should see "2016" in "articleData"

#  Scenario: Show articleData
#    Given I am on "HomePage"
#    When I click on "CLI"
#    Then I should see "2016" in "articleData"