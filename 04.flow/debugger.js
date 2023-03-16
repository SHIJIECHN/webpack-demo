// 1. 引入核心模块
const webpack = require('./webpack');
// 2. 加载配置文件
const options = require('./webpack.config.js');
// 3. 执行webpack得到编译对象Compiler，就是一个大管家，是核心编译对象
const compiler = webpack(options);
// 4. 调用它的run方法开始启动编译
compiler.run();
// debugger
// compiler.run((err, stats) => {
//   // 编译完成后执行回调
//   console.log(err); // 错误信息
//   // stats是编译结果的描述对象
//   console.log(JSON.stringify(stats.toJson({ // 在webpack4里面都是数组，在webpack5中都是Set
//     assets: true, // 产出的资源 main.js
//     chunks: true, // 代码块 main
//     modules: true, // 模块 ['./src/index.js','./src/title.js']
//     entries: true, // 入口 ./src/index.js
//   }), null, 2))
// })
// namedChunkGroups是命名的代码块的组，这个概念是webpack4引入的，是为了实现代码分割 splitChunks