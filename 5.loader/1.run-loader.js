/** 
 * loader是如何组装和工作的 
 * 1. 为什么说loader的执行是从右向左，从下向上
 * 2. 为什么分成四种loader，loader类型不同决定执行的顺序
 *    因为loader配置是分散的，它可能会有多个配置文件合并而来
 * */

const path = require('path');
const fs = require('fs');
const { runLoaders } = require('./loader-runner');
// 源文件的绝对路径 C:/User/src/05.loader/src/index.js
const filePath = path.resolve(__dirname, 'src', 'index.js');
let loaders = [];

// 如何得到 loaders 数组？
// 要加载的资源 require('inline-loader1!inline-loader2!./src/index.js')
const request = `inline-loader1!inline-loader2!${filePath}`;
// 切分，先将前缀去掉，在分割
const parts = request.replace(/^-?!+/, '').split('!');
// 最后一个元素就是要加载的资源文件 ./src/index.js
const resource = parts.pop();
// loader=inline-loader1 => inline-loader1的绝对路径
// c:/user/05.loader/loaders/inline-loader1.js
const resolveLoader = (loader) => path.resolve(__dirname, 'loaders1', loader);
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
    test: /\.js$/, // 没有设置，默认是normal
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
// 通过loader名字，获得loader绝对路径
preLoaders = preLoaders.map(resolveLoader);
postLoaders = postLoaders.map(resolveLoader);
normalLoaders = normalLoaders.map(resolveLoader);

if (request.startsWith('!!')) { // 不要pre、post、normal
  loaders = [...inlineLoaders];
} else if (request.startsWith('-!')) { // 不要pre、normal
  loaders = [...postLoaders, ...inlineLoaders];
} else if (request.startsWith('!')) { // 不要normal
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
  console.log(err)
  console.log(result);
  // "console.log('hello index.js');\r\n" + '//pre2//pre1//normal2//normal1//inline2//inline1//post2//post1'
})

/**
 console.log(loaders);
 [
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\post-loader1',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\post-loader2',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\inline-loader1',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\inline-loader2',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\normal-loader1',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\normal-loader2',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\pre-loader1',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\pre-loader2'
]
 */
/**
 loader里面内容输出：
 post1-pitch
post2-pitch
inline1-pitch
inline2-pitch
normal1-pitch
normal2-pitch
pre1-pitch
pre2-pitch
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

/**
console.log(result);
{
  result: [
    "console.log('hello index.js');\n" +
      '//pre2//pre1//normal2//normal1//inline2//inline1//post2//post1'
  ],
  resourceBuffer: <Buffer 63 6f 6e 73 6f 6c 65 2e 6c 6f 67 28 27 68 65 6c 6c 6f 20 69 6e 64 65 78 2e 6a 73 27 29 3b 0a>,
  cacheable: true,
  fileDependencies: [
    'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\src\\index.js'
  ],
  contextDependencies: [],
  missingDependencies: []
}
 */