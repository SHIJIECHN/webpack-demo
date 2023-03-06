import './index.css';
import './less.less';
import './sass.scss';

const title = require('./title.txt');

console.log(title.default);
document.write(title.default);

/**
 * 在webpack使用图片，介绍三种方式：
 * 1. 直接通过import或者require引入
 */

// require一个图片的话，会返回图片的新路径
// esModel=true或者默认情况下logo.default来取到新的路径，false的话就可以直接只用
const logo = require('./images/logo.png');

const image = new Image();
// image.src = logo.default;
image.src = logo;
document.body.appendChild(image);

// import React from 'react'
// import ReactDOM from 'react-dom'

// ReactDOM.render(<h1>Hello</h1>, document.getElementById('root'));

/**
 * 装饰器
 * @param {*} target 装饰的目标
 * @param {*} key 装饰的key PI
 * @param {*} description 属性描述
 */
// function readonly(target, key, description) {

// }

// class Person {
//   @readonly PI = 3.14
// }

// let p = new Person();
// p.PI = 3.15;
// console.log(p)