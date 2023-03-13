(() => {
  var modules = {
    './src/title.js': (module, exports, require) => {
      // 不管是CommonJS还是es module最后都变成了CommonJS，如果原来是es module的话
      // 就把exports传给r方法处理一下，exports.__esModule = true以后就可以通过这个属性来判断原来是不是es module
      require.r(exports);
      require.d(exports, {
        default: () => DEFAULT_EXPORT, // getter 
        age: () => age
      })
      const DEFAULT_EXPORT = 'title_name'; // 默认导出
      const age = 'title_age'; // age

    }
  }

  var cache = {};
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

  require.r = (exports) => { // r方法作用是添加属性：Symbol.toStringTag和__esModule
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(exports, '__esModule', { value: true }); // __esModule=true 标识
  }
  // 为什么要用一个字母，因为减少打包后的文件体积
  // __webpack_require__ exports definition 都可
  require.d = (exports, definition) => {
    for (let key in definition) { // 循环definition，将属性赋给exports定义属性
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key]
      })
    }
  }

  // .src/index.js
  (() => {
    let title = require('./src/title.js');
    console.log(title);
  })();
})();