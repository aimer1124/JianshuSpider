// features/step_definitions/browser_steps.js
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

module.exports = function () {

    this.Given(/^I am on the Cucumber.js GitHub repository$/, function() {
        return this.driver.get('https://github.com/cucumber/cucumber-js/tree/master');
    });

    this.When(/^I click on "([^"]*)"$/, function (text) {
        return this.driver.findElement({linkText: text}).then(function(element) {
            return element.click();
        });
    });

    this.Then(/^I should see "([^"]*)"$/, function (text) {
        var xpath = "//*[contains(text(),'" + text + "')]";
        var condition = webdriver.until.elementLocated({xpath: xpath});
        return this.driver.wait(condition, 5000);
    });

    this.Given(/^I am on "([^"]*)"$/, function(pageURl) {
        if (pageURl == 'HomePage'){
            return this.driver.get('http://localhost:4001/');
        }else if (pageURl == "articlePage"){
            return this.driver.get('http://localhost:4001/' + "article");
        }else if (pageURl == "collectionsPage"){
            return this.driver.get('http://localhost:4001/' + "collections");
        }else if (pageURl == "userPage") {
            return this.driver.get('http://localhost:4001/' + "user");
        }else {
            return this.driver.get('http://localhost:4001/' + "search");
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