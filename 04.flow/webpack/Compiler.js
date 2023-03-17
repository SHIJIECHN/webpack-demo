let { SyncHook } = require('tapable');
const path = require('path');
const fs = require('fs');
const types = require('babel-types');
const parser = require('@babel/parser');// 解析器，把源代码转成ast
const traverse = rquire('@babe;/traverse').default; // 遍历语法树
const generate = rquire('@babel/generator').defualt; // 把ast重新生成代码

/** 路径\，变成/ */
// path.posix.sep /  不同系统的路径分隔符
function toUnixPath(filePath) {
  return filePath.replace(/\\/g, path.posix.sep);
}
class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(), // 会在开始编译的时候触发
      done: new SyncHook(), // 会结束编译的时候触发
    }
  }

  // 4. 执行对象的 run 方法开始执行编译
  run() {
    // SyncHook 实例有call、tap方法
    // 这里先触发run钩子，再触发done钩子
    this.hooks.run.call(); // 在调用run方法的时候会触发run这个钩子，进而执行它的回调函数
    // 5. 根据配置中的entry找出入口文件，得到entry的绝对路径
    // C:\Users\小石头\Documents\Learning\A01-basicFrontEnd\performance\webpack-demo\04.flow\src\index.js
    // 打包后的文件，所有的路径都是\ => /
    let entry = toUnixPath(path.join(this.options.context, this.options.entry));
    console.log(entry)
    // 6. 从入口文件出发,调用所有配置的Loader对模块进行编译
    let entryModule = this.buildModule(entry);
    // 中间就是编译过程...
    this.hooks.done.call();
  }

  /** 编译模块 1. 读取模块内容 */
  buildModule = (modulePath) => {
    // 先读取原始源代码
    let targetSourceCode, originalSourceCode;
    targetSourceCode = originalSourceCode = fs.readFileSync(modulePath, 'utf8');
    // 查找此模块对应的loader对代码进行转换
    const rules = this.options.module.rules;
    let loaders = [];
    for (let i = 0; i < rules.length; i++) {
      // 正则匹配商量模块的路径
      if (rules[i].test.test(modulePath))
        loaders = [...loaders, ...rules[i].use];
    }
    // loaders执行是从右往左的
    for (let i = loaders.length - 1; i >= 0; i--) {
      let loader = loaders[i];
      targetSourceCode = require(loader)(targetSourceCode);
    }
    // 现在我们已经得到了转换后的代码：babel-loader es6=>es5

    // 7. 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
    // { sourceType: 'module' }表示原代码是一个模块。模块就是里面有module.exports、 exports
    let astTree = parser.parse(targetSourceCode, { sourceType: 'module' });
    // 遍历语法树，并找出require节点
    traverse(astTree, {
      CallExpression: ({ node }) => { // node 节点
        if (node.callee.name === 'require') { // 是require
          // 问题：1. 这里是相对路径 2. 相对于当前模块  
          // 我们希望 1. 拿到绝对路径
          let moduleName = node.arguments[0].value;
          // 要判断一下moduleName绝对还是相对，相对路径才需要下面的处理
          // let depModulePath;
          // if (path.isAbsolute(moduleName)) {
          //   depModulePath = moduleName;
          //   // 获取当前路径所有的目录
          //   let dirname = path.posix.dirname(modulePath); // 加上posix分隔符全部统一为 /
          //   depModulePath = path.posix.join(dirname, moduleName); // 依赖的模块路径
          // }
          // 简化版本只考虑相对路径
          let dirname = path.posix.dirname(modulePath); // 加上posix分隔符全部统一为 /
          let depModulePath = path.posix.join(dirname, moduleName); // 依赖的模块路径

          // 加后缀
          let extensions = this.options.resolve.extensions;
          fs.statSync(depModulePath);
        }
      }
    })
  }

}

module.exports = Compiler;