const path = require('node:path');

module.exports = function consentAnalyticsPlugin() {
  return {
    name: 'consent-analytics-plugin',
    getClientModules() {
      return [path.resolve(__dirname, 'client.ts')];
    },
  };
};
