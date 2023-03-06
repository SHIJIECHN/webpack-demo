// eslint-disable-next-line import/no-extraneous-dependencies
const babelCore = require('@babel/core');
// const presetEnv = require('@babel/preset-env');

/**
 * 实现babel-loader，作用就是调用@babel/core
 * @babel/core 本身只是提供一个管理功能
 *    把源代码转成抽象语法树，进行遍历和生成，它本身也并不知道具体转换什么语法，以及语法如何转换
 * @param {*} source 源文件内容  let sum = (a, b) => a + b;

 */
function loader(source) {
  const es5 = babelCore.transform(source, {
    presets: ['@babel/preset-env'], // 具体如何转换靠preset
  }); // 使用@babel/core转换代码
  return es5;
}

module.exports = loader;
