const { AsyncSeriesWaterfallHook, HookMap } = require('tapable');

const hook = new AsyncSeriesWaterfallHook(['name', 'age']);
console.time('cost');
hook.tapAsync('1', (name, age, callback) => {
  setTimeout(() => {
    console.log(1, name, age);
    callback(null, 1)
  }, 1000)
})
hook.tapAsync('2', (number, age, callback) => {
  setTimeout(() => {
    console.log(2, number, age);
    callback(null, ++number)
  }, 2000)
})
hook.tapAsync('3', (number, age, callback) => {
  setTimeout(() => {
    console.log(3, number, age);
    callback(null, ++number)
  }, 3000)
})

hook.callAsync('zhufeng', 10, (err, data) => {
  console.log(err, data);
  console.timeEnd('cost')
})



// hook.tapPromise('1', (name, age) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log(1, name, age);
//       resolve(1);
//     }, 1000)
//   })
// })
// hook.tapPromise('2', (number, age) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log(2, number, age);
//       resolve(++number);
//     }, 2000)
//   })
// })
// hook.tapPromise('3', (number, age) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log(3, number, age);
//       resolve(++number);
//     }, 3000)
//   })
// })

// hook.promise('zhufeng', 10).then(result => {
//   console.log(result);
//   console.timeEnd('cost');
// })

/**
1 zhufeng 10
2 1 10
3 2 10
3
cost: 6.047s
 */