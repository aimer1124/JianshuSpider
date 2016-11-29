// features/step_definitions/hooks.js
module.exports = function () {
    this.Before({timeout: 60 * 1000}, function() {
    });

    this.After(function() {
        return this.driver.quit();
    });
};

var configure = function () {
    this.setDefaultTimeout(60 * 1000);
};

module.exports = configure;