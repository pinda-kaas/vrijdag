// An example configuration file.
exports.config = {
    directConnect: true,

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },

    // Framework to use. Jasmine 2 is recommended.
    framework: 'jasmine2',

    // Spec patterns are relative to the current working directly when
    // protractor is called.
    specs: ['./modules/common/orders/*.spec.js'],

    chromeDriver:'C:/Users/dcouwenb/protractor/protractor-master/chromedriver_win_26.0.1383.0/chromedriver.exe',

    seleniumServerJar: 'C:/Users/dcouwenb/protractor/protractor-master/chromedriver_win_26.0.1383.0/selenium-server-standalone-2.40.0.jar',

    baseUrl: 'http://localhost:63342/WIP/app/index.html',

    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        isVerbose: true,
        includeStackTrace: true
    }
};
