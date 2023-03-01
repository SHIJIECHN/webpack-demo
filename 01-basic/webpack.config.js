const { resolve } = require('path');
const rawLoader = require('./loaders/raw-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development', // 开发模式：开发环境、生产环境、不指定环境
  entry: './src/index.js', // 入口
  output: {
    path: resolve(__dirname, 'dist'), // 输出文件夹的绝对路径，__dirname 当前文件所在的目录
    filename: 'main.js' // 输出的文件名
  },
  module: {
    rules: [
      { test: '/\.txt$/', use: 'raw-loader' }
      // { test: '/\.txt$/', use: resolve(__dirname, 'loaders', 'raw-loader.js') }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}