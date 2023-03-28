const { ExternalModule } = require("webpack");

class AutoExternalPlugin {
  constructor(options) {
    this.options = options;
    this.importedModules = new Set();// [jquery, lodash]
  }

  apply(compiler) {
    // 普通模块工厂，用来创建普通模块的。for('javascript/auto')拿到它对应的hook
    compiler.hooks.normalModuleFactory.tap('AutoExternalPlugin', (normalModuleFactory) => { // 钩子normalModuleFactory
      // 通过监听normalModuleFactory.hooks.parser可以拿到normalModuleFactory里面的parser解析器
      normalModuleFactory.hooks.parser
        .for('javascript/auto')
        .tap('AutoExternalPlugin', parser => { // babel esprima acorn
          parser.hooks.import.tap('AutoExternalPlugin', (statement, source) => {
            this.importedModules.add(source);// 添加进importedModules中.jquery
          });
          // call监听所有的方法调用，for('require')监听require方法的调用，拿到require的钩子
          parser.hooks.call.for('require', (expression) => {
            let value = expression.arguments[0].value;
            this.importedModules.add(value);
          });
        })
      /**
       * parser是把源代码转换成JS语法树的解析器
       * parser会遍历语法树，遍历过程中会发射很多事件，比如用到import语句就发射parser.hooks.import，触发一个回调
       * statement=import $ from 'jquery', source=jquery
       */

      /**
       * 生产模块
       * 在normalModuleFactory内部，真正的生产模块的方法就是factory
       * 传入factory参数，返回(data, callback) => { }新的工厂方法
       */
      normalModuleFactory.hooks.factorize.tapAsync('AutoExternalPlugin', (resolveData, callback) => {
        let request = resolveData.request; // ./src/index.js  入口模块
        // 生产模块
        if (this.importedModules.has(request)) { // 外部模块
          let variable = this.options[request].expose;// $
          callback(null, new ExternalModule(variable, 'window', request));// 创建模块
        } else {
          // 普通模块
          callback(null, new ExternalModule('jquery', 'window', request));// 创建模块
        }
      })
    })
  }

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