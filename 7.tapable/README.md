## 同步钩子

## 异步钩子

### 1. AsyncParallelHook

- 所有的回调是同时开始的，等所有的回调都完成后才会调用最终的回调

使用：如果是异步钩子，callAsync触发需要传递一个回调函数。

```javascript
const { AsyncParallelHook, HookMap } = require('tapable');
// 异步并行钩子
const hook = new AsyncParallelHook(['name', 'age']);
console.time('cost');
hook.tap('1', (name, age) => {
  console.log(1, name, age);
})
hook.tap('2', (name, age) => {
  console.log(2, name, age);
})
hook.tap('3', (name, age) => {
  console.log(3, name, age);
})

// 如果是异步钩子需要传递一个回调函数
hook.callAsync('zhufeng', 10, (err) => {
  console.log(err);
  console.timeEnd('cost');
})
/**
1 zhufeng 10
2 zhufeng 10
3 zhufeng 10
undefined
 */
```

上面的结果与同步一样，如果要使用实现异步的效果需要tapAsync注册。

使用callback的异步：
```javascript
const { AsyncParallelHook, HookMap } = require('tapable');
// 异步并行钩子，所有的回调是同时开始的
// 等所有的回调都完成后才会调用最终的回调
const hook = new AsyncParallelHook(['name', 'age']);
console.time('cost');
hook.tapAsync('1', (name, age, callback) => {
  // 延迟1s执行回调callback
  setTimeout(() => {
    console.log(1, name, age);
    callback();
  }, 1000)
})
hook.tapAsync('2', (name, age, callback) => {
  // 延迟1s执行回调callback
  setTimeout(() => {
    console.log(2, name, age);
    callback();
  }, 2000)
})
hook.tapAsync('3', (name, age, callback) => {
  // 延迟1s执行回调callback
  setTimeout(() => {
    console.log(3, name, age);
    callback();
  }, 3000)
})

// 如果是异步钩子需要传递一个回调函数
hook.callAsync('zhufeng', 10, (err) => {
  console.log(err);
  console.timeEnd('cost');
})
```

使用Promise
```javascript
const { AsyncParallelHook, HookMap } = require('tapable');
// 异步并行钩子，所有的回调是同时开始的
// 等所有的回调都完成后才会调用最终的回调
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
hook.tapAsync('2', (name, age) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(2, name, age);
      resolve();
    }, 2000)
  })
})
hook.tapAsync('3', (name, age) => {
  return new Promise((resolve) => {
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
```

### 2. AsyncParallerBailHook

```javascript
const { AsyncParallelBailHook, HookMap } = require('tapable');
// 有一个任务返回值不为空就直接结束
// 对Promise来说，就是resolve或reject的值不为空，就执行回调
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
cost: 2.008s
3 zhufeng 10 */
```

### 3. AsyncSeriesHook和AsyncSeriesBailHook



## 实现
