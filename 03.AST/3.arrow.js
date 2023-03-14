let core = require('@babel/core');
let types = require('babel-types');
// let BabelPluginTransform = require('babel-plugin-transform-es2015-arrow-functions')
const sourceCode = `
const sum = (a,b)=>{
  return a+b
}
`;

// babel插件其实是一个对象，它会有一个visitor访问器
let BabelPluginTransform = {
  // 每个插件都会有自己的访问器
  visitor: {
    // 属性就是节点的类型，babel在比阿尼到对应类型的节点的时候会调用此函数
    ArrowFunctionExpression(nodePath) { // 参数是节点的路径
      let node = nodePath.node; // 获取当前路径上的节点
      node.type = 'FunctionExpression';
    }
  }
}
/**
 * babel-core本身只是用来生成语法树，遍历语法树，生成语法树
 * 它本身不负责转换语法树
 */
let targetCode = core.transform(sourceCode, {
  plugins: [BabelPluginTransform]
});
console.log(targetCode.code);