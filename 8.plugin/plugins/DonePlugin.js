class DonePlugin {
  apply(compiler) { // apply方法必须有
    // 调用compiler.hook.done钩子，在构建结束后输出DonePlugin
    compiler.hooks.done.tapAsync('DonePlugin', (stats, callback) => { // 钩子done
      console.log('DonePlugin');
      callback();
    });
  }
}

module.exports = DonePlugin;