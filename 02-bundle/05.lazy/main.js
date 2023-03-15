(() => {
  // 存放所有的模块定义，包括懒加载，或者说异步加载过来的模块定义
  var modules = ({});
  var cache = {};
  // 因为在require的时候，只会读取modules里面的模块定义
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = cache[moduleId] = {
      exports: {}
    }
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  require.f = {};
  // 如何异步加载额外的代码块 chunkId=hello
  // 2. 创建promise，发起jsonp请求
  require.e = (chunkId) => {
    let promises = [];
    require.f.j(chunkId, promises);
    return Promise.all(promises); // 等着额promises数组都成功以后
  }
  require.p = ''; // publicPath资源访问路径 / 或者 ''
  require.u = (chunkId) => { // 参数是代码块的名字，返回值是这个代码块的文件名
    return chunkId + '.main.js'; // hello.main.js
  }
  // 已经安装的代码块 main代码块的名字 0表示已经就绪
  let installedChunks = {
    main: 0,
    // hello: [resolve, reject]
  }
  // 3. 通过JSONP异步加载chunkId，也就是hello这个代码块
  require.f.j = (chunkId, promises) => {
    // 创建一个新的promise，放到了数组中去
    let promise = new Promise((resolve, reject) => {
      installedChunks[chunkId] = [resolve, reject];
    });
    promises.push(promise);
    var url = require.p + require.u(chunkId); // /hello.main.js
    require.l(url); // 加载额外的脚本
  }
  // http://localhost:5500/hello.main.js
  // 4. 通过jsonp请求这个新的地址
  require.l = (url) => {
    let script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script); // 一旦添加到head里，浏览器会立刻发出请求
  }
  // 6. 开始执行回调
  var webpackJsonpCallback = ([chunkIds, moreModules]) => {
    // chunkIds=['hello']
    // let resolves = chunkIds.map(chunkId => installedChunks[chunkId][0]); // resolves数组保存resolve函数
    let resolves = [];
    for (let i = 0; i < chunkIds.length; i++) {
      let chunkData = installedChunks[chunkIds[i]];
      installedChunks[chunkIds[i]] = 0;
      resolves.push(chunkData[0]);
    }
    // 把异步加载回来的额外代码块合并到总的模块定义对象modules上去
    for (let moduleId in moreModules) {
      modules[moduleId] = moreModules[moduleId]
    }
    resolves.forEach(resolve => resolve());
  }
  require.r = (exports) => { // r方法作用是添加属性：Symbol.toStringTag和__esModule
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(exports, '__esModule', { value: true }); // __esModule=true 标识
  }
  require.d = (exports, definition) => {
    for (let key in definition) { // 循环definition，将属性赋给exports定义属性
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })
    }
  }
  // 0. 把空数组赋给window['webpack5']，然后重写了window['webpack5'].push方法
  var chunkLoadingGlobal = window['webpack5'] = [];
  // 然后重写了window['webpack5'].push = webpackJsonpCallback
  chunkLoadingGlobal.push = webpackJsonpCallback;
  // 异步加载hello代码块，把hello代码块里的模块定义合并到主模块定义里面去
  // 再去加载这个hello.js这个模块，拿到模块的导出结果
  // 1. 准备加载异步代码块hello
  require.e("hello").then(require.bind(require, "./src/hello.js")).then(result => {
    console.log(result.default)
  })
})();