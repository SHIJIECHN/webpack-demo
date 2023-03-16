// babel-type是一个用来构建AST节点的工具库
const t = require('babel-types');
/**
 * 把那些importSpecifier变成importDefaultSpecifier
 * visitor.ImportDeclaration={enter(path, state){},leave(){}}
 * 等价于
 * const visitor = { ImportDeclaration(path, state){} }
 */
const visitor = {
  // 捕获ImportDeclaration节点
  ImportDeclaration: {
    // 当进入这个节点的时候，执行此函数 节点的路径path，state是节点的状态
    // opts就是webpack.config.js里面配置的options对象
    enter(path, state = { opts: {} }) { // state的默认值为{opts:{}}
      const { node } = path; // //获取节点
      const { libraryName, libraryDirectory = 'fp' } = state.opts;//获取选项中的支持的库的名称
      const specifiers = node.specifiers; ///获取批量导入声明数组 [ImportSpecifier,ImportSpecifier]
      const source = node.source; // lodash
      //如果当前的节点的模块名称是我们需要的库的名称，并且导入不是默认导入才会进来
      if (libraryName === source.value && !t.isImportDefaultSpecifier(specifiers[0])) {
        // 把每个specifier变成默认导入 遍历批量导入声明数组specifiers
        const defaultImportDeclaration = specifiers.map(specifier => {
          //导入声明importDefaultSpecifier flatten
          const importDefaultSpecifier = t.importDefaultSpecifier(specifier.local);
          return t.importDeclaration(
            [importDefaultSpecifier],
            //导入模块source lodash/flatten
            t.stringLiteral(libraryDirectory
              ? `${libraryName}/${libraryDirectory}/${specifier.imported.name}`
              : `${libraryName}/${specifier.imported.name}`
            )
          );
        })
        path.replaceWithMultiple(defaultImportDeclaration);// 替换当前节点
      }
    }
  }
}

module.exports = function () {
  return {
    visitor
  }
}