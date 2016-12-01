// features/step_definitions/hooks.js
var conf = require("../support/config");
module.exports = function () {


    this.After(function() {
        return this.driver.quit();
    });
};

var configure = function () {
    this.setDefaultTimeout(60 * 1000);
};

module.exports = configure;