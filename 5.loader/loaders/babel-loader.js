const core = require('@babel/core');
const path = require('path');
/**
 * 
 * @param {*} source 上一个loader给我这个loader的内容或者原文件内容
 * @param {*} inputSourceMap 上一个loader传递过来的 sourceMap
 * @param {*} data 本loader额外的数据，每个loader都有一个自己的data，相互之间是完全独立的
 */
function loader(source, inputSourceMap, data) { // es6
  // console.group(this); // loaderContext loader上下文对象
  console.log(data.name); // 获取到pitch中设置的data的值
  const options = { // 传递给babel的参数
    presets: ["@babel/preset-env"], // 声明一个预设
    inputSourceMap,// 上一个loader传递过来的 sourceMap
    sourceMaps: true, // 告诉babel我要生成sourceMap
    filename: path.basename(this.resourcePath),
  }
  // 返回值：code=转换后的新代码，map=source map，需要配置devtool. ast=抽象语法树
  const { code, map, ast } = core.transform(source, options); // babel把es6转成es5
  return this.callback(null, code, map, ast); // null=错误原因
  // return code;
  /**
   * 什么时候之间return code，什么时候调用this.callback呢？
   * this.callback是this上自带的函数。
   * 当你需要返回多个值的时候需要使用this.callback来传递多个值
   * 只需要返回一个值，可以直接return code。
   * 
   * map什么用？可以让我们进行代码调试，debug的时候可以看到源代码
   * ast什么用？如果你返回了ast给webpack。webpack则直接分析就可以，不需要自己转AST了，节约时间。
   * 
   * loader的返回值：
   * loader分成两种：1.最左边的loader，2.其他的loader
   * 最左边的loader 返回值只能是JS代码，因为它的返回值是给webpack，webpack是要用它生成JS AST。
   * 其他的loader 返回值没有要求，可以是任意的内容，但是需要下一个loader能处理
   */
}

// data有什么用？
loader.pitch = function (remainingRequest, previousRequest, data) {
  data.name = 'label-loader-pitch';
}

module.exports = loader
