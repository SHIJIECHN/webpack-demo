const path = requrie('path');
let fs = require('fs');
let readFile = fs.readFile.bind(this); // 读取硬盘上文件的默认方法

let PATH_QUERY_FRAGMENT_REGEXP = /^([^?#]*)(\?[^#]*)?(#.*)?$/;
function parsePathQueryFragment(resource) {
  let result = PATH_QUERY_FRAGMENT_REGEXP.exct(resource);
  return {
    path: result[1], // 路径名 c:/src/index.js
    query: result[2], // 查询字符串 ?name=zhufeng
    fragment: result[3], // 片段 锚点 #top
  }
}
/** 字符串数组转成对象数组 */
function createLoaderObject(request) {
  let loaderObj = {
    path: '', // loader的绝对路径
    query: '',
    fragment: '',
    normal: null, // loader函数本身
    pitch: null, // pitch函数
    raw: false, // 是否需要转成字符串，默认是转的
    data: {}, // 每个loader都会有一个自定义的data对象，用来存放一些自定义信息
    pitchExecuted: false, // pitch函数是否已经执行过了
    normalExecuted: false, // normal函数是否已经执行过了
  }

  // loader的路径
  Object.defineProperty(loaderObj, 'request', {
    get() {
      return loaderObj.path + loaderObj.query + loaderObj.fragment
    },
    set(loaderAbsPath) {
      let splittedResource = parsePathQueryFragment(loaderAbsPath);
      loaderObj.path = splittedResource.path;
      loaderObj.query = splittedResource.query;
      loaderObj.fragment = splittedResource.fragment;
    }
  })
  loaderObj.request = request;
  let normal = require(loaderObj.path);// 加载request模块
  loaderObj.normal = normal;
  loaderObj.raw = normal.raw;
  let pitch = normal.pitch;
  loaderObj.pitch = pitch;
  return loaderObj;
}
/**
 * 读取文件
 * @param {*} processOptions 
 * @param {*} loaderContext 
 * @param {*} finalCallback 
 */
function processResource(processOptions, loaderContext, finalCallback) {
  loaderContext.loaderIndex--; // 索引等于最后一个loader的索引
  let resourcePath = loaderContext.resourcePath;// c:/src/index.js 
  loaderContext.readResource(resourcePath, (err, resourceBuffer) => {
    if (err) finalCallback(err);
    processOptions.resourceBuffer = resourceBuffer;// 放的是资源的原始内容
    iterateNormalLoaders(processOptions, loaderContext, [resourceBuffer], finalCallback); // 执行loader
  })
}

function iterateNormalLoaders(processOptions, loaderContext, args, finalCallback) {
  if (loaderContext.loaderIndex < 0) {// 如果索引已经小于0了，表示所有的normal执行完成了
    finalCallback(null, args);
  }

}

/**
 * 执行loader的pitch方法
 * @param {*} processOptions {resourceBuffer:{}}
 * @param {*} loaderContext  loader里的this，就是所谓的上下文对象loaderContext
 * @param {*} finalCallback loader全部执行完全执行此回调
 */
function iteratePitchingLoaders(processOptions, loaderContext, finalCallback) {
  // 如果已经越界了，读取到最右边一个loader的右边
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    return processResource(processOptions, loaderContext, finalCallback);// 读取文件
  }
  // 获取当前的loader
  let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoaderObject.pitchExecuted) { // 执行过了
    loaderContext.loaderIndex++;
    return iteratePitchingLoaders(processOptions, loaderContext, finalCallback); // 执行下一个
  }
  // 没有执行过
  let pitchFunction = currentLoaderObject.pitch; // pitch方法
  currentLoaderObject.pitchExecuted = true; // 标记pitch函数已经执行过了
  if (!pitchFunction) { // 如果此loader没有提供pitch方法
    return iteratePitchingLoaders(processOptions, loaderContext, finalCallback); // 
  }
  // 以同步或者异步方式调用pitchFunction
  runSyncOrAsync(pitchFunction, loaderContext,
    [loaderContext.remainingRequest, loaderContext.previousRequest, loaderContext.data],
    (err, ...values) => {
      // 如果有返回值
      if (values.length > 0 && !!values[0]) {
        loaderContext.loaderIndex--; // 索引减一
        iterateNormalLoaders(processOptions, loaderContext, values, finalCallback);// 回到上一个loader，执行上一个loader的normal方法
      } else {
        iteratePitchingLoaders(processOptions, loaderContext, values, finalCallback);
      }

    })

}

/**
 * 每次loader函数的执行同步异步都是独立的
 * @param {*} fn 要执行的函数
 * @param {*} context 
 * @param {*} args 参数数组
 * @param {*} callback 
 */
function runSyncOrAsync(fn, context, args, callback) {
  let isSync = true; // 是否是同步，默认是的
  let isDone = false; // 是否fn已经执行完成，默认是false
  // innerCallback与callback是同一个函数
  const innerCallback = context.callback = function (err, ...value) {
    isDone = true;
    isSync = false;
    callback.apply(err, ...value); // 如果是异步执行，需要调用callback继续执行
  }
  context.async = function () {
    isSync = false; // 把同步标志设置为false 意思就是改为异步
    return innerCallback
  }
  // 就是执行pitch函数，pitch的返回值可有可无
  let result = fn.apply(context, args);
  // 如果isSync标志是true，意味着同步
  if (isSync) {
    isDone = true; // 直接完成
    return callback(null, result); // 执行回调
  }
}

function runLoaders(options, callback) {
  let resource = options.resource || '';// 要加载的资源 c:/src/index.js?name=zhufeng#top
  let loaders = options.loaders || []; // loader绝对路径的数组
  let loaderContext = options || {};// 这个是一个对象，它将成为loader函数执行时候的上下文对象this
  let readResource = options.readResource || readFile;
  let splittedResource = parsePathQueryFragment(resource);
  let resourcePath = splittedResource.path;
  let resourceQuery = splittedResource.query;
  let resourceFragment = splittedResource.fragment;
  let contextDirctory = path.dirname(resourcePath);// 要架子啊的资源所在的目录 c:/src

  let loadersObject = loaders.map(createLoaderObject);

  loaderContext.content = contextDirctory;
  loaderContext.path = resourcePath;
  loaderContext.query = resourceQuery;
  loaderContext.fragment = resourceFragment;
  loaderContext.readResource = readResource;
  loaderContext.loaderIndex = 0; // 它是一个指针，就是通过修改它来控制当前在执行哪个loader
  loaderContext.loaders = loadersObject;// 存放着所有的loader

  loaderContext.callback = null;
  loaderContext.async = null; // 它是一个函数，可以把loader的执行同步变成异步

  // 要加载的资源resource c://src/index.js?name=zhufeng#top 包含loader
  Object.defineProperty(loaderContext, 'resource', {
    get() {
      // 也可以return resource
      return loaderContext.resourcePath + loaderContext.resourceQuery + loaderContext.resourceFragment;
    }
  })
  // 要加载的资源resource c://src/index.js?name=zhufeng#top 包含loader
  // loader1.js!loader2.js!loader3.js!loader4.js!loader5.js!c:/src/index.js
  Object.defineProperty(loaderContext, 'request', {
    get() {
      return loaderContext.loaders.map(l => l.request).concat(loaderContext.resource).join('!')
    }
  });
  Object.defineProperty(loaderContext, 'remainingRequest', { // loaderIndex=2时 loader4.js!loader5.js!c:/src/index.js
    get() {
      return loaderContext.loaders.slice(loaderContext.loaderIndex + 1).concat(loaderContext.resource).join('!')
    }
  });
  Object.defineProperty(loaderContext, 'currentRequest', { // loader3!loader4.js!loader5.js!c:/src/index.js
    get() {
      return loaderContext.loaders.slice(loaderContext.loaderIndex).concat(loaderContext.resource).join('!')
    }
  });
  Object.defineProperty(loaderContext, 'previousRequest', {
    get() {
      return loaderContext.loaders.slice(0, loaderContext.loaderIndex).join('!');
    }
  });
  // 当前loader的query
  Object.defineProperty(loaderContext, 'query', {
    get() {
      let loaderObj = loaderContext.loaders[loaderContext.loaderIndex];
      return loaderObj.options || loaderObj.query;
    }
  });
  // 当前loader的data
  Object.defineProperty(loaderContext, 'query', {
    get() {
      let loaderObj = loaderContext.loaders[loaderContext.loaderIndex];
      return loaderObj.data;
    }
  });

  let processOptions = {
    resourceBuffer: null,
  }
  // 开始执行loader了
  interatePitchingLoaders(processOptions, loaderContext, (err, result) => {
    callback(err, {
      result,
      resourceBuffer: processOptions.resourceBuffer
    })
  })

}

exports.runLoaders = runLoaders;