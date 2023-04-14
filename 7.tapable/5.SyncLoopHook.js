const { SyncLoopHook } = require('tapable');
// 不停的循环执行回调函数，直到函数的结果为非undefined
// 特别要注意是每次循环都是从头开始
const hook = new SyncLoopHook(['name', 'age']);
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;

hook.tap('1', (name, age) => {
  console.log(1, 'counter1', counter1);
  if (++counter1) {
    counter1 = 0;
    return; // 返回undefined就标识当前的回调函数循环结束
  }
  return true;
})
hook.tap('2', (name, age) => {
  console.log(2, 'counter2', counter2);
  if (++counter2 == 2) {
    counter2 = 0;
    return; // 返回undefined就标识当前的回调函数循环结束
  }
  return true;
})
hook.tap('3', (name, age) => {
  console.log(3, 'counter3', counter3);
  if (++counter3 == 3) {
    counter3 = 0;
    return; // 返回undefined就标识当前的回调函数循环结束
  }
  return true;
})

hook.call('zhufeng', 10);

/**
1 counter1 0
2 counter2 0
1 counter1 0
2 counter2 1
3 counter3 0
1 counter1 0
2 counter2 0
1 counter1 0
2 counter2 1
3 counter3 1
1 counter1 0
2 counter2 0
1 counter1 0
2 counter2 1
3 counter3 2
 */