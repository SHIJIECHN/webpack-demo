const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: [{
          loader: path.resolve('./loaders/url-loader.js'),
          options: {
            name: '[hash:8].[ext]',
            esModule: false,
            limit: 40 * 1024,
            fallback: path.resolve('./loaders/file-loader.js')
          }
        }],
        include: path.resolve('src')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}