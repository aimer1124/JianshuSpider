var webdriver = require('selenium-webdriver'),
    By = webdriver.By;

var myStepDefinitionsWrapper = function () {

    this.Then(/^I should see type is "([^"]*)" and searchContent is "([^"]*)"\.$/, function (type, content) {
        var flag = false;
        this.driver.findElement(By.css("span.filter-option")).getText().then(function (title) {
            if (type == title) flag = true;
        });
        this.driver.findElement(By.css("input.form-control")).getText().then(function (searchContent) {
            if ( content == searchContent) flag =  true;
        });
        if (flag) return this.driver.className;
    });

    this.Then(/^I should see type is (.*), searchContent is (.*) and searchResult is (.*)\.$/, function (type, content, result) {

        return this.driver.className;
    });

    this.When(/^I set searchType is (.*), searchContent is (.*) and click search button\.$/, function (type, content) {
        if ( type.toString() != "文章") {
            this.driver.findElement(By.css("span.filter-option")).click();
            var typeList = webdriver.until.elementIsVisible(this.driver.findElement(By.css("ul.dropdown-menu li")));
            this.driver.wait(typeList, 1000);
            this.driver.findElement(By.xpath("/html/body/form/div/div/div/ul/li[2]/a/span[2]")).click();
        }
        this.driver.findElement({xpath: "/html/body/form/div/input"}).then(function (ele) {
            ele.sendKeys(content);
        });
        return this.driver.findElement(By.id("searchBtn")).click();
    });
};

module.exports = myStepDefinitionsWrapper;