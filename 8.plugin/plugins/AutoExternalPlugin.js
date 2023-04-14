const { ExternalModule } = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

class AutoExternalPlugin {
  constructor(options) {
    this.options = options;
    this.trandformLibrary = Object.keys(options); // [jquery, lodash] 哪些依赖库需要转化为CDN形式
    this.importedModules = new Set();// [jquery, lodash]
  }

  apply(compiler) {
    // normalModuleFactory 创建后会触发该事件监听函数。
    // 普通模块工厂，用来创建普通模块的。for ('javascript/auto')拿到它对应的hook
    compiler.hooks.normalModuleFactory.tap('AutoExternalPlugin', (normalModuleFactory) => { // 钩子normalModuleFactory
      /**
       * 1. 将模块变成外部模块
       * 在初始化解析模块之前调用
       * 在normalModuleFactory内部，真正的生产模块的方法就是factory
       */
      normalModuleFactory.hooks.factorize.tapAsync('AutoExternalPlugin', (resolveData, callback) => {
        const requireModuleLibrary = resolveData.request; // 获取引入的模块名称
        if (this.trandformLibrary.includes(requireModuleLibrary)) {
          // 如果当前模块需要被处理为外部依赖
          // 首先获得当前模块需要转化称为的变量名
          const externalModuleName = this.options[requireModuleLibrary].expose;
          callback(null, new ExternalModule(externalModuleName, 'window', externalModuleName));
        } else {
          // 正常编译，不需要处理为外部依赖，什么都不做
          callback()
        }
      })

      // 2. 剔除未使用的模块
      // 在编译模块时触发，将模块变成AST阶段调用
      // 通过hookMap.for('javascript/auto') 方法寻找到名为 'javascript/auto' 的 hook 
      // 这个钩子会在compiler对象上的Parser编译js文件时执行
      const hook = normalModuleFactory.hooks.parser.for('javascript/auto')
      hook.tap('AutoExternalPlugin', parser => { // babel esprima acorn
        // 当遇到模块引入语句import时
        importHandler.call(this, parser);
        // 当遇到模块引入语句require时
        requireHandler.call(this, parser);

      })
      /**
       * parser是把源代码转换成JS语法树的解析器
       * parser会遍历语法树，遍历过程中会发射很多事件，比如用到import语句就发射parser.hooks.import，触发一个回调
       * statement=import $ from 'jquery', source=jquery
       */

      // 3. 注入CDN脚本
      compiler.hooks.compilation.tap('AutoExternalPlugin', (compilation) => {
        HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap('AutoExternalPlugin', (data) => {
          // 额外添加scripts
          const scriptTag = data.assetTags.scripts;
          this.trandformLibrary.forEach((library) => {
            scriptTag.unshift({
              tagName: 'script',
              voidTag: false,
              meta: { plugin: 'AutoExternalPlugin' },
              attributes: {
                defer: true,
                type: undefined,
                src: this.options[library].url
              }
            })
          })
        })
      })
    })
  }

}

function importHandler(parser) {
  parser.hooks.import.tap('AutoExternalPlugin', (statement, source) => {
    // 解析当前模块中的import语句
    if (this.trandformLibrary.includes(source)) {
      this.importedModules.add(source);// 添加进importedModules中.jquery
    }
  });
}

function requireHandler(parser) {
  // call监听所有的方法调用，for('require')监听require方法的调用，拿到require的钩子
  parser.hooks.call.for('require').tap('AutoExternalPlugin', (expression) => {
    let moduleName = expression.arguments[0].value;
    if (this.trandformLibrary.includes(moduleName)) {
      this.importedModules.add(moduleName);
    }
  });
}

/**
 * 分成两步：
 * 1. 查找本项目中是否用到了某些模块
 * 2. 界入，改造生产模块的过程，如果这个模块配置为外部模块，就不需要打包了，会走外部模块流程，如果没有配置，就走正常流程。
 * 
 * normalModuleFactory创建普通模块：
 * 1. 找到原始的文件，读出文件内容
 * 2.交给loader进行转换，最终会得到一个JS文件
 * 3.把JS脚本转成AST抽象语法树
 * 4. 遍历抽象语法树，查找里面的依赖模块
 * 5.根据这些信息通过factory方法生产模块，原生的factory方法生产的是普通模块，可以通过插件修改这个生产过程
 * (factory) => (data, callback) => {}等同于

  function (factory) {
    return function (data, callback) { // data模块信息，callback回调
      // 判断data是不是jquery或lodash，如果是，就走另外的生产逻辑。
      factory(data, callback); // 相当于没有改变，还是原来的一样的
    }
  }

 * 
 */
module.exports = AutoExternalPlugin;