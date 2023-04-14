const { AsyncSeriesHook, HookMap } = require('tapable');

const hook = new AsyncSeriesHook(['name', 'age']);
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
      resolve();
    }, 1000)
  })
})
hook.tapPromise('3', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(3, name, age);
      resolve();
    }, 1000)
  })
})

hook.promise('zhufeng', 10).then(result => {
  console.log(result);
  console.timeEnd('cost');
})

/**
1 zhufeng 10
2 zhufeng 10
3 zhufeng 10
undefined
cost: 6.044s
 */