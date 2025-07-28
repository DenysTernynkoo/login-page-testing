const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'file:///mnt/c/Users/Denya',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
