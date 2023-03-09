(() => {
  var modules = {
    './src/title.js': (module) => {
      module.exports = 'title';
    }
  }

  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) { // 先看缓存中有没有已经缓存的模块对象
      return cache[moduleId].exports; // 如果有就直接返回
    }
    // 定义module={ exports: {}}，并将该对象往缓存cache中也缓存一份
    var module = cache[moduleId] = {
      exports: {}
    }
    modules[moduleId](module, module.exports, require); // 从modules中拿出moduleId对应的函数并执行
    return module.exports; // 返回
  }

  // .src/index.js
  (() => {
    let title = require('./src/title.js');
    console.log(title);
  })();
})();