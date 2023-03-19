const { getOptions, interpolateName } = require('loader-utils');// 工具模块
/**
 * file-loader负责打包加载图片，
 * 原理就是将原始文件复制一份到目标目录dist里，然后返回新的文件名
 * 1. 把此文件内容拷贝到目标目录中
 * @param {*} content  
 */
function loader(content) {
  // this=loaderContext
  let options = getOptions(this) || {};// 获取我们在loader中配置的参数对象
  // 获得文件名
  let filename = interpolateName(this, options.name || "[hash].[ext]", { content }); // content文件内容
  // 其实就是想输出目录里多谢一个文件，文件名叫filename，内容
  this.emitFile(filename, content); // this.assets[filename]=content
  if (typeof options.esModule === 'undefined' || options.esModule) {
    return `export default "${filename}"`; // es modules
  } else {
    return `module.exports="${filename}"`; // commonJS
  }
}
loader.raw = true;
module.exports = loader;

/**
 * 为什么返回的都是字符串？
 * 最左边的loader 返回值只能是JS代码，因为它的返回值是给webpack，webpack是要用它生成JS AST。
 */
