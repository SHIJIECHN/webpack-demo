/**
 * pitch function
 * 先拿到style样式，然后创建一个style标签，并插入到页面中
 * 什么时候用到pitch loader？
 * 当你想把最左侧的loader并联使用的时候
 */
const loaderUtils = require("loader-utils");
function normal(inputSource) {

}

normal.pitch = function (remainingRequest, previousRequest, data) {
  console.log('loaderUtils.stringifyRequest: ', loaderUtils.stringifyRequest(this, '!!' + remainingRequest));
  let style = `
    let style = document.createElement('style');
    style.innerHTML = require(${loaderUtils.stringifyRequest(this, '!!' + remainingRequest)});
    document.head.appendChild(style);
  `;
  return style;
}
module.exports = normal;

/**
 * inputSource为
  var list  =[];
  list.toString = function(){ return this.join();}
  ${importCss}
  list.push(\`${result.css}\`)
  module.exports = list;

  remianingLoader 为剩下的loader和要加载的资源路径  ./loaders/css-loader.js!./src/index.css
  !! 只要行内样式

  loaderUtils.stringifyRequest(this, '!!' + remainingRequest) 就是css-loader的返回值list
 */