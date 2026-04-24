// Re-export the handler from main.js which is already properly configured
module.exports = {
  default: async function(req, res) {
    // Import the handler from main.js
    const { default: handler } = require('./dist/main');
    return handler(req, res);
  }
};
