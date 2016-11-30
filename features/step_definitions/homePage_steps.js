// features/step_definitions/browser_steps.js
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

module.exports = function () {

    function combineUrl(page) {
        var baseUrl = "http://localhost:4001/";
        return baseUrl + page;
    }

    this.When(/^I am on "([^"]*)"$/, function(page) {
        if (page == 'HomePage'){
            return this.driver.get(combineUrl(""));
        }else if (page == "articlePage"){
            return this.driver.get(combineUrl("article"));
        }else if (page == "collectionsPage"){
            return this.driver.get(combineUrl("collections"));
        }else if (page == "userPage") {
            return this.driver.get(combineUrl("user"));
        }else if (page == "searchPage") {
            return this.driver.get(combineUrl("search"));
        }

    });

    this.Then(/^I should see "([^"]*)" in "([^"]*)"$/, function (content, area) {
        if (area == "infoData"){
            var xpath = "//*[@id=\"content\"]/td[1][contains(text(),'" + content + "')]";
            var condition = webdriver.until.elementLocated({xpath: xpath});
            return this.driver.wait(condition, 10000);
        } else if (area == "trendData"){
            var css = ".highcharts-xaxis-labels";
            var condition = webdriver.until.elementLocated({css: css});
            return this.driver.wait(condition, 10000);
        } else{
            var xpath = "//*[@id=\"myArticle\"]/div[1]/div[2]/div[2]/table/tbody/tr[1]/td[2][contains(text(),'" + content + "')]";
            var condition = webdriver.until.elementLocated({xpath: xpath});
            return this.driver.wait(condition, 10000);
        }

    });

};