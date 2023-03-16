// let { SyncHook } = require('tapable');

// let syncHook = new SyncHook(['name']);
// // tap类似我么以前学的event库中的on 监听事件
// syncHook.tap('这个名字没有声明用，只是给程序员看', (name) => {
//   console.log(name, '这是一个回调'); // zhufeng 这是一个回调
// })

// syncHook.call('zhufeng'); // 触发监听

class SyncHook {
  constructor(args) {
    this.args = args || [];
    this.taps = []
  }

  tap(name, fn) {
    this.taps.push(fn);
  }

  call() {
    let args = Array.prototype.slice.call(arguments, 0, this.args.length);
    this.taps.forEach(tap => tap(...args))
  }
}
// 不同的事件需要创建不同的hook
// 优点就是结构比较清晰
// webpack事件大概有四五百种，有好几百个钩子，各干各的监听和触发，互不干扰
// 参数：需要给构造函数传给一个形参数组，它将决定在call的时候要接收多少个参数
let aHook = new SyncHook(['a']);
let bHook = new SyncHook(['b']);
// tap类似我么以前学的event库中的on 监听事件
aHook.tap('这个名字没有声明用，只是给程序员看', (name) => {
  console.log(name, '这是一个回调'); // zhufeng 这是一个回调
})

aHook.call('zhufeng'); // 触发监听

bHook.tap('这个名字没有声明用，只是给程序员看', (name) => {
  console.log(name, '这是一个回调'); // zhufeng 这是一个回调
})

bHook.call('zhufeng'); // 触发监听