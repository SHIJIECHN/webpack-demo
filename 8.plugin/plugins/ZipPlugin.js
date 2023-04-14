/**
 * 希望把输出的文件打成一个压缩包做成一个存档文件
 */
const JSZIP = require('jszip');
// const { RawSource } = require('webpack-sources');
class RawSource {
  constructor(source) {
    this._source = source;
  }
  source() {
    return this._source;
  }
  size() {
    return this._source.length;
  }
}
class ZipPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => { // emit钩子，输出assets到output目录之前执行
      let zip = new JSZIP();// 生成压缩包的实例
      for (let filename in compilation.assets) { // 拿到asstes中所有文件。遍历所有文件拿到文件内容
        let source = compilation.assets[filename].source(); // 获取文件内容
        zip.file(filename, source); // 将文件内容放到压缩包里面。参数1文件名，参数2：文件内容
      }
      // 异步生成压缩包。
      zip.generateAsync({ type: 'nodebuffer' }).then(content => {
        compilation.assets['assets.zip'] = new RawSource(content); // 往asstes中输出一个新的文件名
        callback();
      })
    })
  }

}
module.exports = ZipPlugin;