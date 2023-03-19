const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  // 配置如何查找loader
  /*
  resolveLoader: {
    // 1
    alias: {
      'babel-laoder': path.resolve('./loaders/babel-loader.js')
    },
    // 2
    modules: [path.resolve('./loaders'), "node_modules"], // 找不到再找node_modules
  },
  */
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

/**
 * 向使用自定义的loader
 * 三种方法：
 * 1. alias
 * 2. modules
 * 3. use 绝对路径
 */