const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        // 3
        use: [path.resolve('./loaders/babel-loader.js')],
        include: path.resolve('src')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}