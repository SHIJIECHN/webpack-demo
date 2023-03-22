const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [path.resolve('./loaders/style-loader.js'), path.resolve('./loaders/less-loader.js')],
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