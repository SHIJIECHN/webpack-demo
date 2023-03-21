## loader定义

http://zhufengpeixun.com/strong/html/103.5.webpack-loader.html#t21.2%20loader-runner

如何组装成下面形式的数组？
const loaders = [
  path.resolve(__dirname, 'loaders', 'post-loader1.js'),
  path.resolve(__dirname, 'loaders', 'post-loader2.js'),
  path.resolve(__dirname, 'loaders', 'inline-loader1.js'),
  path.resolve(__dirname, 'loaders', 'inline-loader2.js'),
  path.resolve(__dirname, 'loaders', 'normal-loader1.js'),
  path.resolve(__dirname, 'loaders', 'normal-loader2.js'),
  path.resolve(__dirname, 'loaders', 'pre-loader1.js'),
  path.resolve(__dirname, 'loaders', 'pre-loader2.js'),
]

```javascript
// 如何得到
// 要加载的资源 就是文件中有可能写 require('inline-loader1!inline-loader2!./src/index.js')
const request = `inline-loader1!inline-loader2!./src/index.js`; // 如何加载呢？行内loader，就是写在require的loader
// 如何组装loader呢？
// 切分
const parts = request.split('!');
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
    if (rule.enforce === 'pre') {
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
let loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders];
```

1. 参数解构、url拆分成path、query、锚点，loaderContext赋值
2. 开始执行loader，iteratePitchingLoaders ->runSyncOrAsync执行