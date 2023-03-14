// window["webpack5"]里面是二维数组
// window["webpack5"] 是什么
// 5. 执行window["webpack"]上的push方法，传递参数[chunkId, moreModules]
(window["webpack5"] = window["webpack5"] || []).push([["hello"], {
  "./src/hello.js":
    ((module, exports, require) => {
      require.r(exports);
      require.d(exports, {
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      const __WEBPACK_DEFAULT_EXPORT__ = ('hello');
    })
}]);