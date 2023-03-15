// babel-type是一个用来构建AST节点的工具库
const t = require('babel-types');
/**
 * 把那些importSpecifier变成importDefaultSpecifier
 * visitor. ImportDeclaration={enter,leave}
 * 如果直接写给一个函数，就等于给ImportDeclaration.enter赋值
 */
const visitor = {
  // 捕获ImportDeclaration节点
  ImportDeclaration: {
    // 当进入这个节点的时候，执行此函数 节点的路径path，state是节点的状态
    // opts就是webpack.config.js里面配置的options对象
    enter(path, state = { opts: {} }) { // state的默认值为{opts:{}}
      let { opts } = state;
      let { node } = path;
      const specifiers = node.specifiers;
      const source = node.source; // lodash
      // 只处理lodash模块，并且不是一个默认导入的话才需要处理，否则绕过去
      if (opts.libraryName === source.value && !t.isImportDefaultSpecifier(specifiers[0])) {
        // 把每个specifier变成默认导入
        let defaultImportDeclaration = specifiers.map(specifier => {
          let importDefaultSpecifier = t.importDefaultSpecifier(t.identifier(specifier.local));
          // node.sourc.value=lodash fp=opts.libraryDirectory specifier.imported.name=flatten
          return t.importDeclaration([importDefaultSpecifier], t.stringLiteral(`${source.value}/${opts.libraryDirectory}/${specifier.imported.name}`));
        })
        path.replaceWithMultiple(defaultImportDeclaration)
      }

    }

  }
}
module.exports = function (babel) {
  return {
    visitor
  }

}