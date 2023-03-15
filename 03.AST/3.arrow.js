let core = require('@babel/core');
let types = require('babel-types');
let BabelPluginTransformEs2015ArrowFunctions = require('babel-plugin-transform-es2015-arrow-functions')
const sourceCode = `
const sum = (a,b)=>{
  console.log(this);
  return a+b
}
`;

// babel插件其实是一个对象，它会有一个visitor访问器
let BabelPluginTransformEs2015ArrowFunctions2 = {
  // 每个插件都会有自己的访问器
  visitor: {
    // 属性就是节点的类型，babel在比阿尼到对应类型的节点的时候会调用此函数
    ArrowFunctionExpression(nodePath) { // 捕获箭头函数表达式，参数是节点的路径
      let node = nodePath.node; // 获取当前路径上的节点
      // 处理this指针的问题
      const thisBinding = hoistFunctionEnviroment(nodePath); // 提升函数作用域
      node.type = 'FunctionExpression';
    }
  }
}

function findParent(fnPath) {
  do {
    if ((fnPath.isFunction() && !fnPath.isArrowFunctionExpression()) || fnPath.isProgram()) {
      return fnPath;
    }
  } while (fnPath = fnPath.parentPath);

}

function hoistFunctionEnviroment(fnPath) {
  // thisEnvFn=Program节点
  // const thisEnvFn = fnPath.findParent(p => { // 找父节点
  //   // 如果是函数则不能是箭头函数，或者是Program或者是类的属性
  //   return (p.isFunction() && !p.isArrowFunctionExpression()) || p.isProgram();
  // });
  const thisEnvFn = findParent(fnPath);
  // thisPaths就是放着哪些地方用到了this
  let thisPaths = getScopeInfoInformation(fnPath); // 找到作用域信息
  let thisBinding = '_this'; // 把this变量重定向的变量名
  // 如果有地方用到了，则需要在thisEnvFn环境上添加一个语句 let _this = this
  if (thisPaths.length > 0) {
    // 表示在this函数环境中添加一个变量id_this=初始值 this thisExpression
    thisEnvFn.scope.push({
      id: types.identifier('_this'),
      init: types.thisExpression()
    })
    // 遍历所有使用到this的路径节点，把所有thisExpression全变成_this标识符
    thisPaths.forEach(thisChild => {
      let thisRef = types.identifier(thisBinding);
      thisChild.replaceWith(thisRef);
    })
  }
}
function getScopeInfoInformation(fnPath) {
  let thisPaths = [];
  // 遍历当前的path的所有子节点，看谁的类型是ThisExpression
  fnPath.traverse({
    // 找到ThisExpression类型
    ThisExpression(thisPath) {
      thisPaths.push(thisPath)
    }
  })
  return thisPaths;
}
/**
 * babel-core本身只是用来生成语法树，遍历语法树，生成语法树
 * 它本身不负责转换语法树
 */
let targetCode = core.transform(sourceCode, {
  plugins: [BabelPluginTransformEs2015ArrowFunctions2]
});
console.log(targetCode.code);