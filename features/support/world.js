var webdriver = require('selenium-webdriver');

function CustomWorld() {
    this.driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();
}

module.exports = function() {
    this.World = CustomWorld;
};
