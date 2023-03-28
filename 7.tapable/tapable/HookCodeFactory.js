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

  args(options = {}) {  // 形参列表 ///////////////////////////
    const { before, after } = options;
    let allArgs = this.options.args || []; // 原始非参数['name', 'age']
    if (before) allArgs = [before, ...allArgs];
    if (after) allArgs = [...allArgs, after]; // _callback
    if (allArgs.length > 0) {
      return allArgs.join(', '); // name,age,_callback
    }
    return '';
  }

  header() { // 回调函数的头部 var _x = this._x;
    let code = "";
    code += "var _x = this._x;\n";// _x 是回调函数的数组
    if (this.needContext()) { // 如果需要上下文就拼一个空对象/////////////////////////
      code += `  var _context = {};\n`;
    } else {
      code += `  var _context;\n`
    }
    if (this.options.interceptors.length > 0) {
      code += `var _taps = this.taps;`
      code += `var _interceptors = this.interceptors;`
    }
    for (let k = 0; k < this.options.interceptors.length; k++) {
      // 拿到每个拦截器
      const interceptor = this.options.interceptors[k];
      if (interceptor.call) {
        code += `_interceptors[${k}].call(${this.args({
          before: this.needContext() ? '_context' : undefined
        })});`
      }
    }
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
      case 'async':
        fn = new Function(
          this.args({ after: '_callback' }),
          this.header() + this.content({ // content是子类来实现
            onDone: () => '_callback();\n' // 全部完成之后最后执行的回调
          })
        )
        break;
      case 'promise':
        let content = this.content({ // content是子类来实现
          onDone: () => '_resolve();\n' // 全部完成之后最后执行的回调
        });
        content = `return new Promise((function (_resolve, _reject) {
          ${content}
        }));`;
        fn = new Function(
          this.args(),
          this.header() + content);
        break;

    }
    this.deinit(); // 销毁
    return fn;
  }
  callTapsParallel({ onDone }) {
    let code = `var _counter = ${this.options.taps.length};\n`;
    if (onDone) { //   var _done = (function () {  _callback(); });
      code += `
      var _done = (function () {
        ${onDone()}
      });
      `;
    }
    for (let i = 0; i < this.options.taps.length; i++) {
      const done = () => `if (--_counter === 0) _done();`;
      code += this.callTap(i, { onDone: done })
    }
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
    code += current();
    return code;
  }
  ////////////////////////////////
  needContext() {
    for (const tapInfo of this.options.taps) {
      if (tapInfo.context) return true
    }
  }
  /**
   * 第一次执行时，tapIndex=2, onDone=""
   * @param {*} tapIndex 
   * @param {*} param1 
   */


  callTap(tapIndex, { onDone }) {  // 拼接var _fn2 = _x[2]; _fn2(name, age);
    let code = '';
    ////////////////////////////////
    code += `  var _tap${tapIndex} = _taps[${tapIndex}];`
    for (let i = 0; i < this.options.interceptors.length; i++) {
      let interceptor = this.options.interceptors[i];
      if (interceptor.tap) {
        code += `_interceptors[${i}].tap(${this.needContext() && '_context,'} _tap${tapIndex});`
      }
    }
    /////////////
    code += `var _fn${tapIndex} = _x[${tapIndex}];\n`;
    let tap = this.options.taps[tapIndex];
    switch (tap.type) {
      case 'sync':
        code += `_fn${tapIndex}(${this.args({ /////////////////////////
          before: this.needContext() ? '_context' : undefined
        })});`
        if (onDone) {
          code += onDone();
        }
        break;
      case 'async':
        let cbCode = `
          function (_err${tapIndex}) {
            if (_err${tapIndex}) {
              _callback(_err${tapIndex});
            } else {
              ${onDone()}
            }
          }
        `;
        code += `_fn${tapIndex}(${this.args({ after: cbCode })});`;
        break;
      case 'promise':
        code = `
          var _fn${tapIndex} = _x[${tapIndex}];
          var _promise${tapIndex} = _fn${tapIndex}(${this.args()});
          _promise${tapIndex}.then(
            function (_result${tapIndex}) {
              ${onDone()}
            });
        `;
        break;
      default:
    }
    return code;
  }
}
module.exports = HookCodeFactory;