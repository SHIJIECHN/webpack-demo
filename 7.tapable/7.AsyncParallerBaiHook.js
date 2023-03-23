const { AsyncParallelBailHook, HookMap } = require('tapable');
// 有一个任务返回值不为空就直接结束
// 对Promise来说，就是resolve的值不为空
// 如果reject失败了，不影响流程
const hook = new AsyncParallelBailHook(['name', 'age']);
console.time('cost');
hook.tapPromise('1', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(1, name, age);
      resolve();
    }, 1000)
  })
})
hook.tapPromise('2', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(2, name, age);
      resolve('结果2');
    }, 2000)
  })
})
hook.tapPromise('3', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(3, name, age);
      resolve();
    }, 3000)
  })
})

// 实际上就是Promise.all
hook.promise('zhufeng', 10).then(result => {
  console.log(result);
  console.timeEnd('cost');
})

/**
1 zhufeng 10
2 zhufeng 10
结果2
cost: 2.004s
3 zhufeng 10
 */