const Hook = require('./Hook.js'); // 基类
const HookCodeFactory = require('./HookCodeFactory'); // 代码工厂基类
class SynHookCodeFactory extends HookCodeFactory {
  constructor() {
    super()
  }
  content({ onDone }) {
    return this.callTapsSeries({ // callTapsSeries属于父类方法
      onDone
    })
  }

}
let factory = new SynHookCodeFactory(); // 实例化代码工厂
class SyncHook extends Hook {
  compile(options) {
    // compile是代码工厂factory实现。工厂中实现setup和create方法
    // 动态创建函数
    factory.setup(this, options);
    return factory.create(options);
  }
}

module.exports = SyncHook;