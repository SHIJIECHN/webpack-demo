class DonePlugin {

  apply(compiler) { // 定死的
    debugger
    compiler.hooks.done.tapAsync('DonePlugin', (stats, callback) => { // 钩子done
      console.log('DonePlugin');
      callback();
    });
  }
}

module.exports = DonePlugin;