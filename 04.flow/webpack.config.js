const path = require('path');
const DonePlugin = require('./plugins/done-plugin.js');
const RunPlugin = require('./plugins/run-plugin.js');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {},
  plugins: [
    new RunPlugin(),
    new DonePlugin(),
  ]
}