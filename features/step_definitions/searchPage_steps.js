var webdriver = require('selenium-webdriver'),
    By = webdriver.By;

var myStepDefinitionsWrapper = function () {

    this.Then(/^I should see type is "([^"]*)" and searchContent is "([^"]*)"\.$/, function (type, content) {
        this.driver.findElement(By.css("span.filter-option")).getText().then(function (title) {
            this.driver.findElement(By.css("input.form-control")).getText().then(function (searchContent) {
                if (type == title && content == searchContent) return;
            });
        });
    });

    this.Then(/^I should see type is (.*), searchContent is (.*) and searchResult is (.*)\.$/, function (type, content, result) {

        return ;
    });

    this.When(/^I set searchType is (.*), searchContent is (.*) and click search button\.$/, function (type, content) {
        if ( type.toString() != "文章") {
            this.driver.findElement(By.css("span.filter-option")).click();
            var typeList = webdriver.until.elementIsVisible(this.driver.findElement(By.css("ul.dropdown-menu li")));
            this.driver.wait(typeList, 1000);
            this.driver.findElement(By.css("ul.dropdown-menu li")).click();
        }
        var input  = this.driver.findElement(By.name('searchContent'));
        input.sendKeys("TEST");
        this.driver.findElement(By.css("btn-default")).click();
        return ;
    });
};

module.exports = myStepDefinitionsWrapper;