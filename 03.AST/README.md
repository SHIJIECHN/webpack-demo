目标：
- 实现最简单的treeshaking

import { flatten as flat, concat as con } from 'lodash' 
这种写法转成
import flat from 'lodash/flatten';
import con from 'lodash/concat';
导入的方式，因为下面的这种导入方式体积比较小。写法还是第一种，但是实际导入方式修改了


```javascript
// babel-type是一个用来构建AST节点的工具库
const t = require('babel-types');
/**
 * 把那些importSpecifier变成importDefaultSpecifier
 */
const visitor = {
  // 捕获ImportDeclaration节点
  ImportDeclaration: {
    // 当进入这个节点的时候，执行此函数 节点的路径path，state是节点的状态
    // opts就是webpack.config.js里面配置的options对象
    enter(path, state = { opts: {} }) {

      let { node } = path;
      const specifiers = node.specifiers;
      const source = node.source; // lodash
      // 只处理lodash模块，并且不是一个默认导入的话才需要处理，否则绕过去
      if (state.opts.libraryName === source.value && !t.isImportDefaultSpecifier(specifiers[0])) {
        // 把每个specifier变成默认导入
        let defaultspecifiers = specifiers.map(specifier => {
          let importDefaultSpecifier = t.importDefaultSpecifier(t.identifier(specifier.local));
          // node.sourc.value=lodash fp=state.opts.libraryDirectory specifier.imported.name=flatten
          return t.importDeclaration([importDefaultSpecifier], t.stringLiteral(`${node.source.value}/${state.opts.libraryDirectory}/${specifier.imported.name}`));
        })
        path.replaceWithMultiple(defaultspecifiers)
      }

    }

  }
}
module.exports = function (babel) {
  return {
    visitor
  }

}
```