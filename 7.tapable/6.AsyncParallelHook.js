const { AsyncParallelHook, HookMap } = require('./tapable');
// 异步并行钩子，所有的回调是同时开始的
// 等所有的回调都完成后才会调用最终的回调
debugger
const hook = new AsyncParallelHook(['name', 'age']);
console.time('cost');
hook.tapPromise('1', (name, age) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(1, name, age);
      resolve();
    }, 1000)
  })
})
hook.tapPromise('2', (name, age) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(2, name, age);
      resolve();
    }, 1000)
  })
})
hook.tapPromise('3', (name, age) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(3, name, age);
      resolve();
    }, 1000)
  })
})

// 实际上就是Promise.all
hook.promise('zhufeng', 10).then(result => {
  console.log(result);
  console.timeEnd('cost');
})
// hook.tapAsync('1', (name, age, callback) => {
//   // 延迟1s执行回调callback
//   setTimeout(() => {
//     console.log(1, name, age);
//     callback();
//   }, 1000)
// })
// hook.tapAsync('2', (name, age, callback) => {
//   // 延迟1s执行回调callback
//   setTimeout(() => {
//     console.log(2, name, age);
//     callback();
//   }, 2000)
// })
// hook.tapAsync('3', (name, age, callback) => {
//   // 延迟1s执行回调callback
//   setTimeout(() => {
//     console.log(3, name, age);
//     callback();
//   }, 3000)
// })

// // 如果是异步钩子需要传递一个回调函数
// hook.callAsync('zhufeng', 10, (err) => {
//   console.log(err);
//   console.timeEnd('cost');
// })

/**
1 zhufeng 10
2 zhufeng 10
3 zhufeng 101
undefined
cost: 3.003s
 */