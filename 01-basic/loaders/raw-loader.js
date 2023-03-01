/**
 * 本质上是一个哈数，接收源文件，返回一个JS模块代码
 */

function loader(source) {
  reutnr`module.exports = "${source}"`
}

module.exports = loader;