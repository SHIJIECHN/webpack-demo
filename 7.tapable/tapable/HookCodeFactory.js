class HookCodeFactory {
  constructor() { }

  setup(hookInstance, options) {
    // 映射出来一个回调函数的数组，赋给hooks实例的_x属性
    // _x 才是真正回调函数的数组
    hookInstance._x = options.taps.map(item => item.fn);
  }

  init(options) {
    this.options = options; // {taps, args, type}
  }

  deinit() {
    this.options = undefined;
  }

  args() {
    if (Array.isArray(this.options.args)) {
      return this.options.args.join(', '); // name,age
    }
    return '';
  }

  header() {
    let code = "";
    code += "var _x = this._x;\n";// _x 是回调函数的数组
    return code;
  }

  create(options) {
    this.init(options);
    let fn;
    switch (this.options.type) {
      case 'sync':
        fn = new Function(
          this.args(),
          this.header() + this.content({
            onDone: () => ''
          })
        )
    }
    this.deinit();
    return fn;

  }
  callTapsSeries({ onDone }) {
    let code = this.options.taps.map((item, index) => `
        var _fn${index} = _x[${index}];
        _fn${index}(${this.args()});
      `
    ).join('\n');
    return code;
  }

  callTapsSeries1() {
    if (this.options.taps.length === 0) {
      return onDone()
    }
    let code = "";
    let current = onDone;
    for (let j = this.options.taps.length - 1; j >= 0; j--) {
      const content = this.callTap(j, { onDone: current });
      current = () => current;
    }
    code += current;
    return code;
  }

  callTap(tapIndex, { onDone }) {

  }
}
module.exports = HookCodeFactory;