# features/searchPage.feature
Feature: SearchPage feature
  When I open homePage, I can see default Page.
  When I search content by article, I can search the results with content and search content.
  When I search content by user, I can search the results with content and search content which show as followers desc.
  When I search nothing, I can search everything in article and user.

  Scenario: Default page show.
    When I am on "SearchPage"
    Then I should see type is "文章" and searchContent is "".

  @Test
  Scenario Outline: Search function
    When I am on "SearchPage"
    And I set searchType is <searchType>, searchContent is <searchContent> and click search button.
    Then I should see type is <searchType>, searchContent is <searchContent> and searchResult is <searchResult>.

    Examples:
    | searchType | searchContent | searchResult |
    | "文章" | "文章" | "" |

