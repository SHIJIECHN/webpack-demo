const { SyncHook } = require('./tapable');
// 参数是形参的数组，参数名没有意义，但是数组长度有用
debugger
const syncHook = new SyncHook(['name', 'age']);
// 第一个参数是名字，名字没有用
/**
 * 1.参数的长度是有意义的，名字没有用
 * 2.回调函数的执行顺序和放入的顺序有关，先放先执行
 */
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

// syncHook.tap('4', (name, age) => {
//   console.log(4, name, age);
// })

// syncHook.call('jiagou', 10);
