const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = function(options) {
  return {
    ...options,
    target: 'node',
    mode: 'production',
    externals: [nodeExternals()],
    entry: {
      main: './src/main.ts',
      // Separate entry for serverless handler
      handler: './api/index.ts'
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
      library: {
        type: 'commonjs2'
      }
    },
    optimization: {
      minimize: false
    }
  };
};
