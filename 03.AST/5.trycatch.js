// 把一个类转成函数

let core = require('@babel/core');
let types = require('babel-types');
let template = require('@babel/template');
const sourceCode = `
function sum(a,b){
  return a+b+c;
}
`;

// babel插件其实是一个对象，它会有一个visitor访问器
/**
 * 编写插件的一般步骤：
 * 1. 仔细观察转换前和转换后的语法树，找到它们的相同点和不同点
 * 2. 想办法把转换前的转成转换后的，并且要尽可能的复用旧节点
 * 老的没有，新的有，就得创建新节点了，可以通过babel-types可以创建新节点
 */
let TryCatchTransformClasses = {
  // 每个插件都会有自己的访问器
  visitor: {
    FunctionDeclaration(nodePath) {
      let { node } = nodePath;
      let { id } = node;
      let blockStatement = node.body;
      // 如果次函数的对个语句已经是一个try语句了，就不要再处理了，否则会死循环
      if (blockStatement.body && types.isTryStatement(blockStatement.body[0])) {
        return;
      }

      // 把一个JS字符串转成一个AST节点
      let catchStatement = template.statement('console.log(error)')();
      let catchClause = types.catchClause(types.identifier('error'), types.blockStatement([catchStatement]));
      // node.body就是原来的函数里的语句，现在要放到try里面
      let tryStatement = types.tryStatement(node.body, catchClause);
      // 新的函数方法名不变sum，参数不变 a,b
      var func = types.functionDeclaration(id, node.params, types.blockStatement([
        tryStatement
      ]), node.generator, node.async);
      nodePath.replaceWith(func);
    }
  }
}

/**
 * babel-core本身只是用来生成语法树，遍历语法树，生成语法树
 * 它本身不负责转换语法树
 */
let targetCode = core.transform(sourceCode, {
  plugins: [TryCatchTransformClasses]
});
console.log(targetCode.code);

/*
function sum(a,b){
  try{
    return a+b+c;
  }catch(error){
    console.log(error);
  }
}
*/