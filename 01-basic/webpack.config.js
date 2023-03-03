const { resolve } = require('path');
const rawLoader = require('./loaders/raw-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development', // 开发模式：开发环境、生产环境、不指定环境
  entry: './src/index.js', // 入口
  output: {
    path: resolve(__dirname, 'dist'), // 输出文件夹的绝对路径，__dirname 当前文件所在的目录
    filename: 'main.js', // 输出的文件名
    publicPath: '/', // 打包后文件的前缀，通常情况下插入index.html文件中的script文件路径为：src="./main.js", 如果设置了这个参数publicPath: './assets'，则变成：src="./assets/main.js"。于devServer中的publicPath相同
  },
  // devServer会启动一个HTTP开发服务器，把一个文件夹作为静态根目录
  // 为了提高性能，使用内存文件系统
  devServer: {
    contentBase: resolve(__dirname, 'static'),
    writeToDisk: true, // 如果指定此选项，也会把打包后的文件写入磁盘一份，也就是说会在项目下创建dist文件夹
    port: 8080, // 指定HTTP服务器的端口号
    open: false, // true 自动打开浏览器
  },
  module: {
    rules: [
      { test: /\.txt$/, use: ['raw-loader'] },

      { test: /\.css$/, use: ['style-loader', 'css-loader'] }, // CSS
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] }, //less
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] }, // sass
      {
        test: /\.(jpg|png|gif|bmp)$/, use: [{
          loader: 'url-loader', // 打包时将图片拷贝到dist目录下，并重命名文件名
          options: {
            name: '[hash:10].[ext]', //指定文件名
            esModule: false, // 默认导入图片后{default：...}, default后面才是真正的文件。为false表示包装成ES6模块
            limit: 8 * 1024, // 如果文件的体积小于limit，小于8K的话，就转成base64字符串内嵌到HTML中，否则就和file-loader相同
          }
        }]
      }, // 图片
      { test: /\.html$/, use: ['html-loader'] },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}