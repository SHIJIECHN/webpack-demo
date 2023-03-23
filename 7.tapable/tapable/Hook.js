class Hook {
  constructor(args) {
    // 如果不是数组，就设置为空数组
    if (!Array.isArray(args)) args = []
    this._args = args;// 存放形参数组 ['name', 'age']
    this.taps = []; // 存放着所有的回调函数的数组
    this.call = CALL_DELEGATE;
    // this._call = CALL_DELEGATE;
  }

  tap(options, fn) {
    this._tap('sync', options, fn);
  }

  _tap(type, options, fn) {
    if (typeof options === 'string') {
      options = { name: options } // 如果是字符串就转成对象 {name:1}
    }
    const tapInfo = { ...options, type: 'sync', fn };
    this._insert(tapInfo); // 把对象作为参数给insert
  }

  // 插入到taps中
  _insert() {
    // let i = this.taps.length;
    // this.taps[i] = tapInfo;
    this.taps.push(tapInfo);
  }
}

// 创建一个call的代理方法
const CALL_DELEGATE = function (...args) {
  // 动态的创建call方法，并且赋给this.call
  this.call = this._createCall('sync');
  // 执行动态创建出来的call方法
  return this.call(...args);
}

// stage 阶段的概念