let { SyncHook } = require('tapable');
class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(), // 会在开始编译的时候触发
      done: new SyncHook(), // 会结束编译的时候触发
    }
  }

  // 4. 执行对象的 run 方法开始执行编译
  run() {
    // SyncHook 实例有call、tap方法
    this.hooks.run.call(); // 在调用run方法的时候会触发run这个钩子，进而执行它的回调函数
    // 中间就是编译过程...
    this.hooks.done.call();
  }

}
module.exports = Compiler;