const { getOptions } = require('loader-utils');
const loaderUtils = require("loader-utils");
const postcss = require('postcss');
const Tokenizer = require('css-selector-tokenizer');

function loader(inputSource) {
  let loaderOptions = getOptions(this) || {};
  const callback = this.async();// 同步变成异步
  // 遍历语法树，找到@import
  const cssPlugin = (options) => {
    return (root) => {
      if (loaderOptions.import) {
        // 1.删除所有的import 2. 把导入的css文件路径添加到options.imports里
        root.walkAtRules(/^import$/i, (rule) => {
          rule.remove();// 在css脚本里把@import删除
          options.imports.push(rule.params.slice(1, -1));// rule.params="./global.css" 去掉空格
        })
      }

      if (loaderOptions.url) {
        // 2. 遍历语法树，找到里面所有的url
        // 因为这个正则只能匹配属性
        root.walkDecls(decl => {
          let values = Tokenizer.parseValues(decl.value);
          // console.log("values", JSON.stringify(values, null, 2));
          values.nodes.forEach(node => {
            node.nodes.forEach(item => {
              if (item.type === 'url') {
                // 找到url了 ./images/kf.jpg
                // stringifyRequest可以把任意路径标准化成相对路径
                let url = loaderUtils.stringifyRequest(this, item.url);
                console.log(url); // "./images/kf.jpg"
                item.stringType = "'";
                item.url = "`+require(" + url + ")+`"; // 把图片地址变成require语句，
                // 这个require会给webpack看和分析，webpack一看你引入了一张图片
                // 文本pack会使用file-loader去加载图片
              }
            })
          })
          // 重新把对象变成字符串赋值给decl.value 
          // url('./images/kf.jpg')=> +require('./images/kf.jpg')
          let value = Tokenizer.stringifyValues(values);
          decl.value = value;
        })
      }
    }
  }
  // 将会用它来收集所以的import
  let options = { imports: [] }
  // 固定写法
  const pipeline = postcss([cssPlugin(options)]);
  // 将源代码转成语法树，插件可以编译语法树
  pipeline.process(inputSource).then(result => {
    let { importLoaders = 0 } = loaderOptions; // 几个前置loader
    let { loaders, loaderIndex } = this; // 所有loader的数组和当前loader的索引
    let loadersRequest = loaders.slice( // 截取
      loaderIndex,
      loaderIndex + 1 + importLoaders // 包含自己和前面importLoaders个
    ).map(x => x.request).join('!');// request就是loader的绝对路径
    // css-loader.js的绝对路径!less-loader.js的绝对路径!./global.js

    // url=./global.js 
    // -! 不要前置和普通。因为已经变成行内了
    // stringifyRequest 把请求变成字符串 ""
    let importCss = options.imports
      .map((url) => `list.push(...require(` + loaderUtils.stringifyRequest(this, `-!${loadersRequest}!${url}`) + `));`).join("\r\n");

    // 将去掉import后的代码拿出来，放到list中
    // 将模板字符加上``，再用\r\n连接。也就是list.push(require('./src/global.css).toString());
    // require('./src/global.css)返回一个数组，再添加到list中
    // let importCSS = options.imports.map(url => `list.push(...require('./global.css))`).join('\r\n')
    const script = `
      var list  =[];
      list.toString = function(){ return this.join();}
      ${importCss}
      list.push(\`${result.css}\`)
      module.exports = list;
    `;
    callback(null, script);
  })

}

module.exports = loader;
/**
  1. 语法树生成
  const pipeline = postcss([cssPlugin(options)]);
  pipeline.process(inputSource).then(result => {})
  2. 遍历
  const cssPlugin = (options)=>{
    return (root)=>{}
  }
 */

/**
 * 注意：
 * 1.什么代码是在什么时候执行的 
 * css-loader是在webpack处理index.js里的index.css依赖的时候执行
 * 返回此代码
 * var list  =[];
    list.toString = function(){ return this.join();}
    // webpack会分析这个依赖，并且打包./global.css，也会走css-loader
    list.push(require('./global.css').toString());
    list.push(\`${result.css}\`)
    module.exports = list;
    此代码也是js的，然后给了webpack，
    webpack也要把它转成JS的抽象语法树，分析require import依赖
    webpack会去处理 './src/global.css' 这个依赖
 */