
// 创建一个call的代理方法
const CALL_DELEGATE = function (...args) {
  // 动态的创建call方法，并且赋给this.call
  this.call = this._createCall('sync');
  // 执行动态创建出来的call方法
  return this.call(...args);
}

class Hook {
  constructor(args) { // 形参列表args
    if (!Array.isArray(args)) args = [];// 如果不是数组，就设置为空数组
    this.args = args;// 存放形参数组 ['name', 'age']
    this.taps = []; // 存放着所有的回调函数的数组
    this.call = CALL_DELEGATE;
  }

  tap(options, fn) { // 调用tap方法的时候
    this._tap('sync', options, fn);
  }

  _tap(type, options, fn) { // options='1'与options={name:'1'}是等价的
    if (typeof options === 'string') {
      options = { name: options } // 如果是字符串就转成对象 {name:1}
    }
    const tapInfo = { ...options, type, fn }; // {name: '1', type: 'sync', fn: ƒ}
    this._insert(tapInfo); // 把对象作为参数给insert，在insert中将tapInfo放入taps中
  }
  // tapsInfo插入到taps中
  _insert(tapInfo) {
    this.taps.push(tapInfo);
  }
  _createCall(type) {
    return this.compile({ // 子类调用compiler，compiler实现子类里
      taps: this.taps, // 存放着回调函数的数组
      args: this.args, // ['name','age']
      type,
    })
  }
}
// stage 阶段的概念
module.exports = Hook;