
// 创建一个call的代理方法
const CALL_DELEGATE = function (...args) {
  // 动态的创建call方法，并且赋给this.call
  this.call = this._createCall('sync');
  // 执行动态创建出来的call方法
  return this.call(...args);
}

const CALL_ASYNC_DELEGATE = function (...args) {
  this.callAsync = this._createCall("async");
  return this.callAsync(...args);
};
const PROMISE_DELEGATE = function (...args) {
  this.promise = this._createCall("promise");
  return this.promise(...args);
};

class Hook {
  constructor(args) { // 形参列表args
    if (!Array.isArray(args)) args = [];// 如果不是数组，就设置为空数组
    this.args = args;// 存放形参数组 ['name', 'age']
    this.taps = []; // 存放着所有的回调函数的数组
    this.call = CALL_DELEGATE; // call方法的代理
    this.callAsync = CALL_ASYNC_DELEGATE; // callAsync方法的代理 
    this.promise = PROMISE_DELEGATE; // promise
    this.interceptors = [];///////////////////////////
  }

  tap(options, fn) { // 调用tap方法的时候
    this._tap('sync', options, fn);
  }
  tapAsync(options, fn) {
    this._tap('async', options, fn);
  }
  tapPromise(options, fn) {
    this._tap('promise', options, fn);
  }
  _tap(type, options, fn) { // options='1'与options={name:'1'}是等价的
    if (typeof options === 'string') {
      options = { name: options } // 如果是字符串就转成对象 {name:1}
    }
    let tapInfo = { ...options, type, fn }; // {name: '1', type: 'sync', fn: ƒ}
    tapInfo = this._runRegisterInterceptors(tapInfo);//////////////////////////////
    this._insert(tapInfo); // 把对象作为参数给insert，在insert中将tapInfo放入taps中
  }
  _runRegisterInterceptors(tapInfo) {////////////////////////////////
    for (const interceptor of this.interceptors) {
      if (interceptor.register) { // 如果有注册拦截器
        let newTapInfo = interceptor.register(tapInfo);
        if (newTapInfo) {
          tapInfo = newTapInfo
        }
      }
    }
    return tapInfo;
  }
  intercept(interceptor) {/////////////////////////////
    this.interceptors.push(interceptor)
  }
  _resetCompilation() {
    this.call = CALL_DELEGATE;
  }
  // tapsInfo插入到taps中
  _insert(tapInfo) {
    this._resetCompilation(); // 重置编译
    // this.taps.push(tapInfo);////////////stage///////////
    let before;
    if (typeof tapInfo.before == 'string') {
      before = new Set([tapInfo.before]);
    } else if (Array.isArray(tapInfo.before)) {
      before = new Set(tapInfo.before);// 数组转成集合
    }
    let stage = 0;
    if (typeof tapInfo.stage === 'number') {
      stage = tapInfo.stage;
    }
    let i = this.taps.length;
    while (i > 0) {
      i--;
      const x = this.taps[i];
      this.taps[i + 1] = x;
      const xStage = x.stage;
      if (before) {
        if (before.has(x.name)) { // before有没有当前tapInfo.name
          before.delete(x.name); // 从set中删除
          continue;
        }
        if (before.size > 0) { // before里面还有东西，就继续循环
          continue;
        }
      }
      if (xStage > stage) {
        continue;
      }
      i++;
      break;
    }
    this.taps[i] = tapInfo;
  }
  _createCall(type) {
    return this.compile({ // 子类调用compiler，compiler实现子类里
      taps: this.taps, // 存放着回调函数的数组
      args: this.args, // ['name','age']
      interceptors: this.interceptors, ///////////////////////
      type,
    })
  }
}
// stage 阶段的概念
module.exports = Hook;