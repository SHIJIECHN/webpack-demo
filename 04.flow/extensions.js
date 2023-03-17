let extensions = ['', '.js', '.jsx', '.json',];
let modulePath = 'E:/A01-basicFrontEnd/performance/webpack-demo/04.flow/src/title';
const fs = require('fs');

let exist1 = fs.existsSync(modulePath);
console.log(exist1);
let exist2 = fs.existsSync(modulePath + '.js');
console.log(exist2);

let exist = false;
// let index = 0;
// do {
//   exist = fs.existsSync(modulePath+extensions[index++]);
// } while (!exist)

function tryPath(modulePath, originalModulePath, moduleContext) {
  for (let i = 0; i < extensions.length; i++) {
    if (fs.existsSync(modulePath + extensions[i])) {
      return modulePath + extensions[i]
    }
  }
  throw new Error(`Module not found: Error: can't resolve '${originalModulePath}' in '${moduleContext}'`)
}
tryPath(modulePath, './title', 'E:/A01-basicFrontEnd/performance/webpack-demo/04.flow/src')
