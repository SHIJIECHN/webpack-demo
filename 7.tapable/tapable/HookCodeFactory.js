class HookCodeFactory {
  constructor() { }
  // 初始化。hookInstance为syncHook实例，
  // options为{ taps: [{..},{..},{..}], args: ['name', 'age'], type: 'sync}
  setup(hookInstance, options) {
    // 映射出来一个回调函数的数组，赋给hooks实例的_x属性
    // _x 才是真正回调函数的数组
    hookInstance._x = options.taps.map(item => item.fn);
  }

  init(options) { // 给options赋值
    this.options = options; // {taps, args, type}
  }

  deinit() { // 销毁参数
    this.options = undefined;
  }

  args() {  // 形参列表
    if (Array.isArray(this.options.args)) {
      return this.options.args.join(', '); // name,age
    }
    return '';
  }

  header() { // 回调函数的头部 var _x = this._x;
    let code = "";
    code += "var _x = this._x;\n";// _x 是回调函数的数组
    return code;
  }

  create(options) {
    this.init(options); // 初始化参数
    let fn; // 将要创建的fn
    switch (this.options.type) {
      case 'sync':
        fn = new Function( // 动态创建一个函数
          this.args(),// 参数
          this.header() + this.content({ // content是子类来实现
            onDone: () => '' // onDone就是最后执行的代码块
          })
        )
        break;
    }
    this.deinit(); // 销毁
    return fn;
  }
  callTapsSeries1({ onDone }) {
    // 拼接代码块 var _fn0 = _x[0]; _fn0(name, age);
    let code = this.options.taps.map((item, index) => `
        var _fn${index} = _x[${index}];
        _fn${index}(${this.args()});
      `
    ).join('\n');
    return code;
  }

  callTapsSeries({ onDone }) {
    if (this.options.taps.length === 0) {
      return onDone()
    }
    let code = "";
    let current = onDone;
    for (let j = this.options.taps.length - 1; j >= 0; j--) { // 倒序循环taps
      const content = this.callTap(j, { onDone: current });
      current = () => content;
    }
    code += current;
    return code;
  }
  /**
   * 第一次执行时，tapIndex=2, onDone=""
   * @param {*} tapIndex 
   * @param {*} param1 
   */

  callTap(tapIndex, { onDone }) {  // 拼接var _fn2 = _x[2]; _fn2(name, age);
    let code = '';
    code += `var _fn${tapIndex} = _x[${tapIndex}];`;
    let tap = this.options.taps[tapIndex];
    switch (tap.type) {
      case 'sync':
        code += `_fn${tapIndex}(${this.args()});`
        if (onDone) {
          code += onDone();
        }
        break;
      default:
    }
    return code;
  }
}
module.exports = HookCodeFactory;