const { SyncHook } = require('tapable');
class HookMap {
  constructor(factory) {
    this._map = new Map();// 存放钩子，key是名字，value是实例
    this._factory = factory;
  }
  get(key) {
    return this._map.get(key);
  }
  tap(key, options, fn) {
    return this.for(key).tap(options, fn)
  }
  for(key) {
    const hook = this.get(key);// 钩子
    if (hook) { // 如果有钩子，就返回钩子
      return hook;
    }
    // 没有钩子，就创建钩子
    let newHook = this._factory(key); // new SyncHook(['name'])
    this._map.set(key, newHook);
    return newHook;
  }
}

const keyedHookMap = new HookMap(() => new SyncHook(['name']));// 创建一个map，value是钩子函数实例
keyedHookMap.tap('key1', 'plugin1', (name) => { console.log(1, name) }); // 第一种方式，传三个参数
keyedHookMap.for('key2').tap('plugin2', (name) => { console.log(2, name) });// 第二种方式，先for再tap
const hook1 = keyedHookMap.get('key1'); // 取出key1对应的钩子，然后执行
hook1.call('zhufeng');
const hook2 = keyedHookMap.get('key2');
hook2.call('jiagou')