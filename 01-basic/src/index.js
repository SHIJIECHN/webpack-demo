import './index.css'
import './less.less'
import './sass.scss'

let title = require('./title.txt');
console.log(title.default)
document.write(title.default);

/**
 * 在webpack使用图片，介绍三种方式：
 * 1. 直接通过import或者require引入
 */

// require一个图片的话，会返回图片的新路径
// esModel=true或者默认情况下logo.default来取到新的路径，false的话就可以直接只用
let logo = require('./images/logo.png')
let image = new Image()
// image.src = logo.default;
image.src = logo;
document.body.appendChild(image);