(() => {
  var modules = {
    "./src/index.js":
      ((module, exports, require) => {
        require.r(exports);
        var title = require("./src/title.js"); // {name: 'title_name', age: 'title_age'}
        // n方法有什么用? 在这个地方我根本不知道title.js是es module还是commonJS
        var title_default = require.n(title);
        console.log((title_default())); // 默认值
        console.log(title.age);// age

      }),
    "./src/title.js":
      (module) => {
        module.exports = {
          name: 'title_name',
          age: 'title_age'
        }
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
  require.n = (exports) => {
    // 如果是es6模块，返回值就是exports default类型，如果是CommonJS模块就返回它自己
    var getter = exports._esModule ? () => exports.default : () => exports;
    return getter;
  };

  require.r = (exports) => { // r方法作用是添加属性：Symbol.toStringTag和__esModule
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(exports, '__esModule', { value: true }); // __esModule=true 标识
  }
  // 为什么要用一个字母，因为减少打包后的文件体积
  // __webpack_require__ exports definition 都可
  require.d = (exports, definition) => {
    for (let key in definition) { // 循环definition，将属性赋给exports定义属性
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })
    }
  }

  // .src/index.js
  (() => {
    require("./src/index.js");
  })();
})();