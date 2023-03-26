const Hook = require('./Hook.js');
const HookCodeFactory = require('./HookCodeFactory');
class SynHookCodeFactory extends HookCodeFactory {
  constructor() {
    super()
  }
  content({ onDone }) {
    return this.callTapsSeries({
      onDone
    })
  }

}
let factory = new SynHookCodeFactory();
class SyncHook extends Hook {
  compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}

module.exports = SyncHook;