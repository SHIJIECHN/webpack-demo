let { SyncHook } = require('./tapable');
let hook = new SyncHook(['name']);
debugger
hook.tap({ name: 'tap1' }, (name) => {
  console.log('tap1', name);
})
hook.tap({ name: 'tap3' }, (name) => {
  console.log('tap3', name);
})
hook.tap({ name: 'tap4' }, (name) => {
  console.log('tap4', name);
})
hook.tap({ name: 'tap2', before: ['tap4', 'tap3'] }, (name) => { // 回调再tap3、tap4之前执行
  console.log('tap2', name);
})

hook.call('zhufeng');

/**
 * before优先级比stage高
 */