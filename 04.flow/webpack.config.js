const path = require('path');
const DonePlugin = require('./plugins/done-plugin.js');
const RunPlugin = require('./plugins/run-plugin.js');

module.exports = {
  mode: 'production',
  context: process.cwd(), // 根目录 current working directory
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, 'loaders', 'logger-loader.js'),
          path.resolve(__dirname, 'loaders', 'logger1-loader.js'),
        ]
      }
    ]
  },
  plugins: [
    new RunPlugin(),
    new DonePlugin(),
  ]
}