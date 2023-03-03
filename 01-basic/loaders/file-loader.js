
/**
 * loader.raw = true的话loader得到的是一个二进制的Buffer；false的话loader得到的是一个utf8字符串
 * @param {*} source 
 */
function loader(source) {
  // 1. 生成文件名
  let filename = "f0a12b17c9.png"
  // 2. 向输出目录写入一个文件 this.emitFile

  // 3. 返回igeJS脚本
  return `module.exports = "${filename}"`

}
loader.war = true; // 图片的话需要raw为 true
module.exports = loader;