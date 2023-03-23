const { SyncHook } = require('tapable');
debugger
const syncHook = new SyncHook(['name', 'age']);

syncHook.tap('1', (name, age) => {
  console.log(1, name, age);
})
syncHook.tap('2', (name, age) => {
  console.log(2, name, age);
})
syncHook.tap('3', (name, age) => {
  console.log(3, name, age);
})

syncHook.call('zhufeng', 10);
/**
 * 1. 实例化类
 * 2. tap就是存放回调函数
 * 3. call就是执行回调函数
 * 
 * tapable是因为优化方法 懒编译
 */