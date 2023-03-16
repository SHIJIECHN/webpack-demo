// 把一个类转成函数

let core = require('@babel/core');
let types = require('babel-types');
let BabelPluginTransformClasses = require('@babel/plugin-transform-classes')
const sourceCode = `
class Person {
  constructor(name) {
    this.name=name;
  }
  getName() {
    return this.name;
  }
}
`;

// babel插件其实是一个对象，它会有一个visitor访问器
/**
 * 编写插件的一般步骤：
 * 1. 仔细观察转换前和转换后的语法树，找到它们的相同点和不同点
 * 2. 想办法把转换前的转成转换后的，并且要尽可能的复用旧节点
 * 老的没有，新的有，就得创建新节点了，可以通过babel-types可以创建新节点
 */
let BabelPluginTransformClasses2 = {
  // 每个插件都会有自己的访问器
  visitor: {
    ClassDeclaration(nodePath) {
      let { node } = nodePath;
      let { id } = node; // Person标识符
      let classMethods = node.body.body;// 获取原来类上的方法 constructor getName
      let body = [];
      classMethods.forEach(method => {
        console.log(method)
        if (method.kind === 'constructor') { // 如果方法的类型是构造函数的话
          // Person [name] this.name=name(body复用) 
          let construcorFunction = types.functionDeclaration(id, method.params, method.body, method.generator, method.async);
          body.push(construcorFunction)
        } else {// 其他的函数属于普通函数，需要放在原型上的
          // method.key=getName
          // Person.prototype.getName
          let left = types.memberExpression(types.memberExpression(id, types.identifier('prototype')), method.key);
          let right = types.functionExpression(null, method.params, method.body, method.generator, method.async);
          let assignmentExpression = types.assignmentExpression('=', left, right);
          body.push(assignmentExpression)
        }
      })
      // nodePath.replaceWith();// 替换成单节点
      nodePath.replaceWithMultiple(body); // 替换成多节点
    }
  }
}

/**
 * babel-core本身只是用来生成语法树，遍历语法树，生成语法树
 * 它本身不负责转换语法树
 */
let targetCode = core.transform(sourceCode, {
  plugins: [BabelPluginTransformClasses2]
});
console.log(targetCode.code);

// function Person(name) {
//   this.name = name;
// }
// Person.prototype.getName = function () {
//   return this.name;
// }