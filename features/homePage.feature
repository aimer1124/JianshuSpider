# features/homePage.feature
Feature: HomePage feature
  When I open homePage
  So that I can see infoData, trendData and articleData.

  Scenario Outline: Show infoData
    When I am on <Page>
    Then I should see <Data> in <Area>

    Examples:
      | Page     | Area     | Data |
      | "HomePage" | "infoData" | "2016" |
      | "HomePage" | "trendData" | "2016" |
      | "HomePage" | "articleData" | "2016" |

