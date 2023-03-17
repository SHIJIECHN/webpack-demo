const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  devtool: 'source-map',
  watch: true,
  devServer: {
    https: true, // 使用HTTPS提供服务
    contentBase: path.resolve(__dirname, 'static'),
    host: 'localhost',
    port: '3000',
    proxy: {
      '/api': {
        target: 'http://localhost:3001/', // 代理服务器
        pathRewrite: {
          '^/api': '', // 重写路径
        },
        secure: true, // 允许在HTTPS上运行后端服务器
        changeOrigin: true, // 修改主机来源
      },
    },
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      {
        test: /\.png|jpeg$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[hash:8].[ext]',
            esModule: false,
          },
        }],
      },
      {
        test: /\.png|jpeg$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[hash:8].[ext]',
            esModule: false,
            limit: 8 * 1024,
          },
        }],
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.jsx$/,
        use: [{
          loader: 'babel-loader',
          options: {
            preset: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: { version: 3 },
                target: {
                  chrome: '60',
                },
              }],
              '@babel/preset-react',
            ],
            plugins: [
              ['@babel/plugin-propopsal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
            ],
          },
        }],
      },
      {
        test: /\.jsx$/,
        use: [{
          loader: 'eslint-loader',
          options: { fix: true },
        }],
        enforce: 'pre',
        include: path.resolve(__dirname, 'src');
      },

    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: '[name].main.js',
    }),
  ],
};