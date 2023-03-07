const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { webpack, ProvidePlugin } = require('webpack');
// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 拷贝静态文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 打包前清空目录
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取css到单独文件

module.exports = {
  mode: 'development', // 开发模式：开发环境、生产环境、不指定环境
  devtool: false,
  entry: {
    main: './src/index.js',
    vendor: ['lodash'], // 第三方
  },
  // entry: './src/index.js', // 入口
  // watch: true, // 开启监控模式
  // watchOptions: {
  //   ignored: /node_modules/, // 忽略的文件夹
  //   aggregateTimeout: 300, // 监听到变化后会等300ms再去执行（防抖的优化）
  //   poll: 1000, // 轮询。每秒问操作系统多少次文件是否变化
  // },
  output: {
    path: resolve(__dirname, 'dist'), // 输出文件夹的绝对路径，__dirname 当前文件所在的目录
    filename: '[name].[chunkhash:8].js', // 输出的文件名
    publicPath: '/', // 上线后有可能把资源文件放在CDN
  },
  // devServer会启动一个HTTP开发服务器，把一个文件夹作为静态根目录
  // 为了提高性能，使用内存文件系统
  devServer: {
    contentBase: resolve(__dirname, 'static'),
    writeToDisk: true, // 如果指定此选项，也会把打包后的文件写入磁盘一份，也就是说会在项目下创建dist文件夹
    port: 8080, // 指定HTTP服务器的端口号
    open: false, // true 自动打开浏览器
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3333',
    //     pathRewrite: {
    //       '^/api': '',
    //     },
    //   },
    // },
    before(app) { // webpack-dev-server本质是一个express服务器 app
      app.get('/api/users', (req, res) => {
        res.json([{ name: 'zhufeng2', age: 12 }]);
      });
    },
    after(app) {
      app.get('/api/users', (req, res) => {
        res.json([{ name: 'zhufeng2', age: 12 }]);
      });
    },
  },
  externals: {
    lodash: '_', // 如果在模块内部引用了lodash这个模块，会从window._上取值
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
      // {
      //   test: /\.jsx?$/,
      //   use: [
      //     {
      //       loader: 'babel-loader',
      //       options: {
      //         // 预设（插件的集合）
      //         presets: [
      //           // '@babel/preset-env', // 可以转换JS语法
      //           ['@babel/preset-env', { // 可默认只转换map set等，不能转换promise，需要配置参数
      //             useBuiltIns: 'usage', // 按加载polyfill
      //             corejs: { version: 3 }, // 指定corejs的版本号 2或者3 polyfill
      //             targets: { // 指定要兼容哪些浏览器
      //               chrome: '60',
      //             },
      //           }],
      //           '@babel/preset-react', // 可以转换JSX语法
      //         ],
      //         // 插件
      //         plugins: [
      //           ['@babel/plugin-proposal-decorators', { legacy: true }], // 使用装饰器语法
      //           ['@babel/plugin-proposal-class-properties', { loose: true }], // 类属性
      //         ],
      //       },
      //     },
      //   ],
      // },
      { test: /\.txt$/, use: ['raw-loader'] },

      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] }, // CSS
      { test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'] }, // less
      { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] }, // sass
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
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
    }),
    // 会自动向模块内部注入lodash模块, 在模块内部可以通过 _ 引用
    // new ProvidePlugin({
    //   _: 'lodash',
    // }),

    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'lodash', // 模块名
    //       entry: 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.js', // CDN脚本地址
    //       global: '_', // 全局变量名
    //     },
    //   ],
    // }),
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
