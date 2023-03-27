const Hook = require('./Hook.js'); // 基类
const HookCodeFactory = require('./HookCodeFactory'); // 代码工厂基类
class AsyncParallelHookCodeFactory extends HookCodeFactory {
  content({ onDone }) {
    // 并行
    return this.callTapsParallel({ // callTapsSeries属于父类方法
      onDone
    })
  }

}
let factory = new AsyncParallelHookCodeFactory(); // 实例化代码工厂
class AsyncParallelHook extends Hook {
  compile(options) {
    // compile是代码工厂factory实现。工厂中实现setup和create方法
    // 动态创建函数
    factory.setup(this, options);
    return factory.create(options);
  }
}

module.exports = AsyncParallelHook;