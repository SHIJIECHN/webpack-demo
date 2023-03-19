const mime = require('mime');
const { getOptions, interpolateName } = require('loader-utils');// 工具模块

function loader(content) {
  // content 默认格式是字符串
  let options = getOptions(this) || {};
  // limit默认值8K
  let { limit = 8 * 1204, fallback = "file-loader" } = options;
  const mimeType = mime.getType(this.resourcePath); // image/jpeg
  if (content.length < limit) {
    let base64Str = `data:${mimeType};base64,${content.toString('base64')}`; // 固定格式
    // stringify 要让他是一个字符串，而非变量
    return `module.exports=${JSON.stringify(base64Str)}`;
  } else {
    // 大于阈值就是用file-loader
    let fileLoader = require(fallback);
    return fileLoader.call(this, content);
  }

}
// function loader(source) {
//   let options = getOptions(this) || {};
//   let { limit, fallback = 'file-loader' } = options;
//   if (limit) {
//     limit = parseInt(limit, 10);
//   }
//   const mimetype = mime.getType(this.resourcePath);
//   if (!limit || source.length < limit) {
//     let base64 = `data:${mimetype};base64,${source.toString('base64')}`;
//     return `module.exports = ${JSON.stringify(base64)}`;
//   } else {
//     let fileLoader = require(fallback || 'file-loader');
//     return fileLoader.call(this, source);
//   }
// }
// 如果你不希望webpack帮你把内容转成字符串的话，loader.raw=true，
// 这样的话content就是一个二进制Buffer
loader.raw = true;
module.exports = loader;
