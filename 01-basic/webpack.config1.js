const { resolve, join, basename } = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { webpack, ProvidePlugin } = require('webpack');
// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 拷贝静态文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 打包前清空目录
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取css到单独文件
// const TerserPlugin = require('terser-webpack-plugin'); // 压缩JS
// const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩CSS

const pagesRoot = resolve(__dirname, 'src', 'pages'); // 页面所在的根路径
const pages = fs.readdirSync(pagesRoot); // 读取pages下的所有文件
const htmlWebpackPlugins = [];
const entry = pages.reduce((entry, filename) => {
  // entry[page1] = '...'
  const entryname = basename(filename, '.js');
  entry[entryname] = join(pagesRoot, filename);
  htmlWebpackPlugins.push(new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: `${entryname}.html`, // html文件名
    chunks: [entryname], // page1.html 应用 page1 的资源
  }));
  return entry;
}, {});

console.log(entry);
/**
 * {
 *  page1: 'C:\\Users\\webpack-demo\\01-basic\\src\\pages\\page1.js',
 *  page2: 'C:\\Users\\webpack-demo\\01-basic\\src\\pages\\page2.js'
 * }
 */

module.exports = {
  mode: 'development', // 开发模式：开发环境、生产环境、不指定环境
  devtool: false,
  entry,
  output: {
    path: resolve(__dirname, 'dist'), // 输出文件夹的绝对路径，__dirname 当前文件所在的目录
    filename: '[name].js', // 输出的文件名
    publicPath: '/', // 上线后有可能把资源文件放在CDN
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
      {
        test: require.resolve('lodash'),
        loader: 'expose-loader',
        options: {
          globalName: '_',
          override: true,
        },
      },
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader', // 先进行代码校验，再进行编译代码
        options: { fix: true }, // 启动自动修复
        enforce: 'pre', // 强制指定顺序 pre 之前。pre normal inline pos
        // exclude: /node_modules/, // 不需要检查node_modules里面的代码
        include: resolve(__dirname, 'src'), // 只减产src目录里面的文件
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // 预设（插件的集合）
              presets: [
                ['@babel/preset-env'], // 只转换语法，不转换API和方法
                '@babel/preset-react', // 可以转换JSX语法
              ],
              // 插件
              plugins: [
                ['@babel/plugin-transform-runtime', {
                  corejs: 3, // 配置corejs 可以转换API和方法
                  helpers: false,
                  regenerator: false,
                }],
                ['@babel/plugin-proposal-decorators', { legacy: true }], // 使用装饰器语法
                ['@babel/plugin-proposal-class-properties', { loose: true }], // 类属性
              ],
            },
          },
        ],
      },
      { test: /\.txt$/, use: ['raw-loader'] },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 一个rem是多少个像素
              remPrecision: 8, // 计算rem的单位，保留几位小数，设置精度
            },
          },
        ],
      }, // CSS
      { test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'] }, // less
      { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'] }, // sass
      {
        test: /\.(jpg|png|gif|bmp)$/,
        use: [{
          loader: 'url-loader', // 打包时将图片拷贝到dist目录下，并重命名文件名
          options: {
            name: '[hash:10].[ext]', // 指定文件名
            esModule: false, // 默认导入图片后{default：...}, default后面才是真正的文件。为false表示包装成ES6模块
            limit: 8 * 1024, // 如果文件的体积小于limit，小于8K的话，就转成base64字符串内嵌到HTML中，否则就和file-loader相同
            outputPath: 'images', // 默认情况下图片放在dist根目录下，指定写入到输出目录dist/images
            publicPath: '/images', // 使用outputPath时，需要加上publicPath
          },
        }],
      }, // 图片
      { test: /\.html$/, use: ['html-loader'] },
    ],
  },
  plugins: [
    ...htmlWebpackPlugins,
    // new HtmlWebpackPlugin({
    //   template: './src/index.html',
    //   filename: 'page1.html', // html文件名
    //   chunks: ['page1'], // page1.html 应用 page1 的资源
    // }),
    // new HtmlWebpackPlugin({
    //   template: './src/index.html',
    //   filename: 'page2.html',
    //   chunks: ['page2'],
    // }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    // new OptimizeCssAssetsWebpackPlugin(), // 压缩CSS
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, 'src/design'),
          to: resolve(__dirname, 'dist/design'),
        },
      ],
    }),
    new CleanWebpackPlugin({ // 在重新打包前先把输出目录清空一下
      cleanOnceBeforeBuildPatters: ['**/*'],
    }),
  ],
};
