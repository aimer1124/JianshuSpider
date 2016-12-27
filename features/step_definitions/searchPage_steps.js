var webdriver = require('selenium-webdriver'),
    By = webdriver.By;

var myStepDefinitionsWrapper = function () {

    this.Then(/^I should see type is "([^"]*)" and searchContent is "([^"]*)"\.$/, function (type, searchContent) {
        var flag = false;


        var xpath = "/html/body/form/div/div/button/span[1][contains(text(),'" + type + "')]";
        var condition = webdriver.until.elementLocated({xpath: xpath});
        return this.driver.wait(condition, 10000);


    });

    this.Then(/^I should see type is (.*), searchContent is (.*) and searchResult is (.*)\.$/, function (type, content, result) {

        var flag = false;
        this.driver.findElement(By.css("span.filter-option")).getText().then(function (title) {
            console.log("SearchType is " + title);
            if (type == title) flag = true;
        });
        this.driver.findElement(By.css("input.form-control")).getText().then(function (searchContent) {
            console.log("SearchContent is " + searchContent);
            if ( flag && content == searchContent) flag =  true;
        });

        console.log("Flag is " + flag);

        if (flag) {

            var xpath = "//*[@id=\"user\"]/div[1]/div[2]/div[2]/table/tbody/tr[1]/td[1]/a[contains(text(),'" + "233123" + "')]";
            var condition = webdriver.until.elementLocated({xpath: xpath});
            return this.driver.wait(condition, 10000);
        }

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