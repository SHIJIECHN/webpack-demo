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
          // loader: 'url-loader',
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

/**
 * 向使用自定义的loader
 * 三种方法：
 * 1. alias
 * 2. modules
 * 3. use 绝对路径
 */