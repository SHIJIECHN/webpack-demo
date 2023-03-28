const { SyncHook } = require('./tapable');
const syncHook = new SyncHook(['name', 'age']);

syncHook.intercept({
  context: true, // 需要一个上下文对象
  register: (tapInfo) => { // 当你注册一个回调函数的时候触发
    console.log(`${tapInfo.name}-1注册`);
    tapInfo.register1 = 'register1';
    return tapInfo;
  },
  tap: (context, tapInfo) => { // 每个回调函数都会触发一次
    console.log(`开始触发`, context);
    if (context) {
      context.name1 = 'name1';
    }
  },
  call: (context, name, age) => {// 每个call触发，所有的回调只会共触发一次
    console.log(`开始调用1, `, context, name, age);
  }
})
syncHook.intercept({
  context: true, // 需要一个上下文对象
  register: (tapInfo) => { // 当你注册一个回调函数的时候触发
    console.log(`${tapInfo.name}-2注册`);
    tapInfo.register2 = 'register2';
    return tapInfo;
  },
  tap: (context, tapInfo) => { // 每个回调函数都会触发一次
    console.log(`开始触发`, context);
    if (context) {
      context.name2 = 'name2';
    }
  },
  call: (context, name, age) => {// 每个call触发，所有的回调只会共触发一次
    console.log(`开始调用2, `, context, name, age);;
  }
})

// 注册 let tapInfo = {name, type, fn, context}
syncHook.tap({ name: '函数A', context: true }, (name, age) => {
  console.log('回调1', name, age);
})
// console.log(syncHook.taps[0]);
/**
{
  type: 'sync',
  fn: [Function (anonymous)],
  name: '函数A',
  context: true,
  register1: 'register1',
  register2: 'register2'
}
 */
syncHook.tap({ name: '函数B', context: true }, (name, age) => {
  console.log('回调2', name, age);
})
debugger
syncHook.call('zhufeng', 10)

/**
 * register拦截的是注册
 * tap拦截的是回调之前
=register=
函数A-1注册
函数A-2注册
函数B-1注册
函数B-2注册

=call=
开始调用1,  {} zhufeng 10
开始调用2,  {} zhufeng 10

=tap=
开始触发 {}
开始触发 { name1: 'name1' }
回调1 { name1: 'name1', name2: 'name2' } zhufeng

=tap=
开始触发 { name1: 'name1', name2: 'name2' }
开始触发 { name1: 'name1', name2: 'name2' }
回调2 { name1: 'name1', name2: 'name2' } zhufeng
 */