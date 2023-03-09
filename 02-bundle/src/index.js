let title = require('./title.js');
console.log(title.name); //Module = { age: 'title_age', default: 'title_name'}
console.log(title.age); // title_age

/**
 * CommonJS导入ES6。title有两个属性:
 * {
 *    default: 'title_name', // 默认导出放在default属性上
 *    age: 'title_age', 
 * }
 */

