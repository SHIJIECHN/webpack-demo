// 动态import，并给模块一个名称
import(/* webpackChunkName: "hello" */ './hello.js').then(result => {
  console.log(result.default)
})