const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
    devtool: false,
    resolve: {

    },
    resolveLoader: {
        alias: { 'css-loader': path.resolve(__dirname, 'loaders', 'css-loader.js') },
        // 先找loaders里面的模块，没有再找node_modules
        // modules: [path.resolve(__dirname, 'loaders'), 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "to-string-loader",
                    {
                        loader: 'css-loader',
                        options: {
                            url: true,//是否解析url()
                            import: true,//是否解析@import语法
                            esModule: false,//不包装成ES MODULE，默认是common.js导出
                            //importLoaders:0//在处理导入的CSS的时候，要经过几个前置loader的处理
                        }
                    },
                ],
                include: path.resolve('src')
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }),
    ]
}