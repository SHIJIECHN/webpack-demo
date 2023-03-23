function fn1() {

}

const fn2 = () => {

}

function sum(a, b) {
  return a + b;
}

// 所有函数内部底层实现
// 动态创建函数然后执行
let minus = new Function('a,b', 'return a-b');
console.log(minus(2, 1));// 1