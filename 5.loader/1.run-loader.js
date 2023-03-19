/** 
 * loader是如何组装和工作的 
 * 1. 为什么说loader的执行是从右向左，从下向上
 * 2. 为什么分成四种loader，loader类型不同决定执行的顺序
 *    因为loader配置是分散的，它可能会有多个配置文件合并而来
 * */

const path = require('path');
const fs = require('fs');
const { runLoaders } = require('loader-runner');
const filePath = path.resolve(__dirname, 'src', 'index.js'); // 源文件的绝对路径

// 如何得到
// 要加载的资源 就是文件中有可能写 require('inline-loader1!inline-loader2!./src/index.js')
const request = `inline-loader1!inline-loader2!${filePath}`; // 如何加载呢？
// 如何组装loader呢？
// 切分
const parts = request.replace(/^-?!+/, '').split('!'); // 先将前缀去掉，在分割
const resource = parts.pop();// 最后一个元素就是要加载的资源了
// loader=inline-loader1   inline-loader1的绝对路径
const resolveLoader = (loader) => path.resolve(__dirname, 'loaders', loader);
// inlineLoaders = [inline-loader1的绝对路径, inline-loader2的绝对路径]
const inlineLoaders = parts.map(resolveLoader);
// 配置文件rules数组
const rules = [
  {
    test: /\.js$/,
    enforce: 'pre', // 一定先执行
    use: ['pre-loader1', 'pre-loader2']
  },
  {
    test: /\.js$/,
    use: ['normal-loader1', 'normal-loader2']
  },
  {
    test: /\.js$/,
    enforce: 'post', // post webpack保证一定是最后执行的
    use: ['post-loader1', 'post-loader2']
  },
];
let preLoaders = [];
let postLoaders = [];
let normalLoaders = [];
for (let i = 0; i < rules.length; i++) {
  let rule = rules[i];
  // 正则匹配上了模块的路径
  if (rule.test.test(resource)) {
    if (rule.enforce === 'pre') { // enforce: 'pre'
      preLoaders.push(...rule.use)
    } else if (rule.enforce === 'post') {
      postLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use)
    }
  }
}
// 名字变成绝对路径
preLoaders = preLoaders.map(resolveLoader);
postLoaders = postLoaders.map(resolveLoader);
normalLoaders = normalLoaders.map(resolveLoader);
let loaders = [];
if (request.startsWith('!!')) { // 不要pre、post、auto
  loaders = [...inlineLoaders];
} else if (request.startsWith('-!')) { // 不要pre、auto
  loaders = [...postLoaders, ...inlineLoaders];
} else if (request.startsWith('!')) { // 不要auto
  loaders = [...postLoaders, ...inlineLoaders, ...preLoaders];
} else {
  loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders];
}

console.log(loaders);

/**
 * 1. 读取要加载的资源
 * 2. 把资源传递给loader链条，一一处理，最后得到结果
 */
runLoaders({
  // 加载和转换的资源 可以包含查询字符串
  resource,
  // loader的绝对路径
  loaders,
  // 额外的loader上下文对象
  context: { name: 'zhufeng' },
  // 读取文件的方法
  readResource: fs.readFile.bind(fs)
}, function (err, result) {
  console.log(result); // "console.log('hello index.js');\r\n" + '//pre2//pre1//normal2//normal1//inline2//inline1//post2//post1'
})
/**
pre2
pre1
normal2
normal1
inline2
inline1
post2
this.name:  zhufeng
post1
 */