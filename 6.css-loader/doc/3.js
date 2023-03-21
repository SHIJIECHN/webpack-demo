var postcss = require("postcss");
let Tokenizer = require('css-selector-tokenizer');
const cssPlugin = (options) => {
  // root为CSS AST语法树的根节点
  return (root, result) => {
    root.walkAtRules();//遍历所有的＠Rule @import
    root.walkDecls((decl) => { // 遍历所有的decl。语法树的遍历
      // console.log('decl: ', decl.value);
      // if (decl.value.endsWith('px')) { // 修改
      //   decl.value = parseFloat(decl.value) / 75 + 'rem';
      // }
      let values = Tokenizer.parseValues(decl.value);
      // console.log("values", JSON.stringify(values, null, 2));
      values.nodes.forEach(node => {
        node.nodes.forEach(item => {
          if (item.type === 'url') {
            console.log(item.url);
          }
        })
      })
    });
  };
};
let options = {};
let pipeline = postcss([cssPlugin(options)]);
let inputSource = `
#root{
  background-image: url('./images/kf.jpg');
  background-size: contain;
  width: 100px;
  height: 100px;
}`;

// postcss内容 pipeline其实先把CSS源代码转成CSS抽象语法树
// 2.遍历语法树，让插件进行处理
pipeline.process(inputSource).then((result) => {
  console.log(result.css);
})