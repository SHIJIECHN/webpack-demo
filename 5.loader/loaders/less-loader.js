/**
 * 把Less变成css
 */
let less = require('less');
function loader(content) {
  // 通过调用this.async方法可以返回一个函数，它会把loader的执行变成异步的，不会直接往下执行了，
  // 什么时候继续执行？调用callback。
  // 默认情况下loader执行是同步的
  console.log('this.resource', this.resource);
  // this.callback===callback 后面会将它的实现
  let callback = this.async();
  // 把less转成css
  less.render(content, { filename: this.resource }, (err, output) => {
    // 会让loader继续往下执行
    callback(err, output.css);
  })
}

module.exports = loader;