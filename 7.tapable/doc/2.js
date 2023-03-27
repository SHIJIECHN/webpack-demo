// 惰性函数


const CALL_DELEGATE = (...args) => {
  call = () => { // 给call方法重新赋值
    console.log('这是动态创建出来的call方法')
  }
}
let call = CALL_DELEGATE;
call(); // 第一次加载返回的是CALL_DELEGATE里面的函数
// 第二次调用时，直接执行
call(); // 这是动态创建出来的call方法
call(); // 这是动态创建出来的call方法

/**
 * 为什么这么做呢？
 * 1. 为了性能。2. 只能这么实现。
 */