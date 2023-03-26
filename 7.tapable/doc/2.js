// 惰性函数

let call = CALL_DELEGATE;
function CALL_DELEGATE(...args) {
  call = () => {
    console.log('这是动态创建出来的call方法')
  }
}
call(); // 第一次加载返回的是CALL_DELEGATE里面的函数
call(); // 这是动态创建出来的call方法
call(); // 这是动态创建出来的call方法

/**
 * 为什么这么做呢？
 * 1. 为了性能
 */