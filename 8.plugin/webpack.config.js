const AssetsPlugin = require('./plugins/AssetsPlugin.js')
const DonePlugin = require('./plugins/DonePlugin.js')
const ZipPlugin = require('./plugins/ZipPlugin.js')
const HtmlWebpackPlugin = require('html-webpack-plugin');
let AutoExternalPlugin = require('./plugins/AutoExternalPlugin.js')
module.exports = {
  mode: 'development',
  devtool: 'cheap-source-map',
  entry: './src/index.js',
  // externals: {
  //   'jquery': '$'
  // },
  plugins: [
    // new DonePlugin(),
    // new AssetsPlugin(),
    // new ZipPlugin()
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new AutoExternalPlugin({
      jquery: {
        expose: '$',
        url: 'https://cdn.bootcss.com/jquery/3.1.0/jquery.js'
      },
      lodash: {
        expose: '_',
        url: 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.js'
      }
    })
  ]
}