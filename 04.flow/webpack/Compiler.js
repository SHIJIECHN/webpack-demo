let { SyncHook } = require('tapable');
const path = require('path');
const fs = require('fs');
const types = require('babel-types');
const parser = require('@babel/parser');// 解析器，把源代码转成ast
const traverse = require('@babel/traverse').default; // 遍历语法树
const generate = require('@babel/generator').default; // 把ast重新生成代码

/** 路径 \，变成 /  */
// path.posix.sep /  不同系统的路径分隔符
function toUnixPath(filePath) {
  return filePath.replace(/\\/g, path.posix.sep);
}

const baseDir = toUnixPath(process.cwd());// 根目录，当前工作目录
class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(), // 会在开始编译的时候触发
      done: new SyncHook(), // 会结束编译的时候触发
    };
    this.modules = []; // 这里存放着所有的模块
    this.chunks = []; // 代码块 webpack5 this.chunks = new Set()
    this.assets = {}; // 输出列表，存放着将要产出的资源文件
    this.files = []; // 表示本次编译的所有产出的文件名
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
    // 6. 从入口文件出发,调用所有配置的Loader对模块进行编译
    let entryModule = this.buildModule(entry);
    // this.modules.push(entryModule); // 入口模块
    // 中间就是编译过程...
    console.log(this.modules);
    // 8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
    let chunk = { name: 'main', entryModule, modules: this.modules }
    this.chunks.push(chunk)
    // 9. 再把每个 Chunk 转换成一个单独的文件加入到输出列表
    this.chunks.forEach(chunk => {
      // key是文件名，value是打包后的文件内容
      this.assets[chunk.name + '.js'] = getSource(chunk);
    })
    // 10. 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
    this.files = Object.keys(this.assets); // 文件名数组 ['main.js']
    // 存放本次边柜输出的目标文件路径
    let targetPath = path.join(this.options.output.path,
      this.options.output.filename);
    for (let file in this.assets) {
      fs.writeFileSync(targetPath, this.assets[file])
    }

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
    let moduleId = './' + path.posix.relative(baseDir, modulePath); // 当前模块id
    // webpack最核心的几个概念：module，module中有模块ID、模块依赖数组
    let module = { id: moduleId, dependencies: [] }
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
          let moduleName = node.arguments[0].value; // ./title
          // 要判断一下moduleName绝对还是相对，相对路径才需要下面的处理
          // let depModulePath;
          // if (path.isAbsolute(moduleName)) {
          //   depModulePath = moduleName;
          //   // 获取当前路径所有的目录
          //   let dirname = path.posix.dirname(modulePath); // 加上posix分隔符全部统一为 /
          //   depModulePath = path.posix.join(dirname, moduleName); // 依赖的模块路径
          // }
          // 简化版本只考虑相对路径
          // modulePath = 'C:/Users/小石头/Documents/Learning/A01-basicFrontEnd/performance/webpack-demo/04.flow/src/index.js'
          // dirname = 'E:\A01-basicFrontEnd\performance\webpack-demo\04.flow\src' 模块所在文件的目录
          let dirname = path.posix.dirname(modulePath); // 加上posix分隔符全部统一为 /
          // 'C:/Users/小石头/Documents/Learning/A01-basicFrontEnd/performance/webpack-demo/04.flow/src/title' 模块路径
          let depModulePath = path.posix.join(dirname, moduleName); // 依赖的模块路径
          // 加后缀
          let extensions = this.options.resolve.extensions;
          // depModulePath = E:\A01-basicFrontEnd\performance\webpack-demo\04.flow\src\title.js 完整路径
          depModulePath = tryExtensions(depModulePath, extensions, moduleName, dirname);
          // 模块ID的问题，每个打包的模块都会有一个moduleId
          // path.posix.relative 获取相对路径
          // ./src/title.js   depModulePath=/a/b/c    baseDir=/a/b   relative= c
          let depModuleId = './' + path.posix.relative(baseDir, depModulePath); // ./src/title.js
          //修改抽象语法树
          node.arguments = [types.stringLiteral(depModuleId)]; // 改变参数：./title.js 变成 ./src/title/js 
          module.dependencies.push(depModulePath);// 添加依赖
        }
      }
    })

    // 根据新的语法树，生成新代码
    let { code } = generate(astTree);
    module._source = code; // 转换后的代码。目前为止，module上有三个属性了：moduleId, dependencies _source
    // 7. 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
    module.dependencies.forEach(dependency => {
      let dependencyModule = this.buildModule(dependency);
      this.modules.push(dependencyModule)
    })
    return module;
  }

}

// let chunk = { name: 'main', entryModule, modules: this.modules }
function getSource(chunk) {
  return `
  (() => {
    var modules = ({
      ${chunk.modules.map(module => `
        "${module.id}": (module, exports, require)=>{
          ${module._source}
        }`).join(',')
    }
    });
    var cache = {};
    function require(moduleId) {
      var cachedModule = cache[moduleId];
      if (cachedModule !== undefined) {
        return cachedModule.exports;
      }
      var module = cache[moduleId] = {
        exports: {}
      };
      modules[moduleId](module, module.exports, require);
      return module.exports;
    }
    (() => {
      ${chunk.entryModule._source}
    })();
  })()
    ;  
  `;
}

/**
 * 给文件加后缀，看看文件是否存在，如果存在就返回，如果没有找到就抛出错误
 * @param {*} modulePath 模块的绝对路径（没有后缀）....../04.flow/src/title
 * @param {*} extensions 扩展名：['.js', '.jsx', '.json']
 * @param {*} originalModulePath  // 模块的导入名 ./title
 * @param {*} moduleContext // 模块上下文目录 ....../04.flow/src
 * @returns 
 */
function tryExtensions(modulePath, extensions, originalModulePath, moduleContext) {
  for (let i = 0; i < extensions.length; i++) {
    if (fs.existsSync(modulePath + extensions[i])) {
      return modulePath + extensions[i]
    }
  }
  throw new Error(`Module not found: Error: can't resolve '${originalModulePath}' in '${moduleContext}'`)
}
module.exports = Compiler;