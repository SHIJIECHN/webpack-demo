var postcss = require("postcss");
const cssPlugin = (options) => {
  // root为CSS AST语法树的根节点
  return (root, result) => {
    root.walkAtRules();//遍历所有的＠Rule @import
    root.walkDecls((decl) => { // 遍历所有的decl。语法树的遍历
      console.log('decl: ', decl)
      if (decl.value.endsWith('px')) { // 修改
        decl.value = parseFloat(decl.value) / 75 + 'rem';
      }
    });
  };
};
let options = {};
let pipeline = postcss([cssPlugin(options)]);
let inputSource = `
#root{
    width:750px;
}`;

// postcss内容 pipeline其实先把CSS源代码转成CSS抽象语法树
// 2.遍历语法树，让插件进行处理
pipeline.process(inputSource).then((result) => {
  console.log(result.css);
})