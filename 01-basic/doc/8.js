console.log(Object.prototype.toString.call('foo')); // [object String]
console.log(Object.prototype.toString.call([])); // [object Array]
console.log(Object.prototype.toString.call(1)); // [object Number]
console.log(Object.prototype.toString.call(true)); // [object Boolean]
console.log(Object.prototype.toString.call(null)); // [object Null]
console.log(Object.prototype.toString.call(undefined)); // [object Undefined]

const myExports = {};
console.log(Object.prototype.toString.call(myExports)); // [object Object]
Object.defineProperty(myExports, Symbol.toStringTag, { value: 'Module' });
// myExports[Symbol.toStringTag] = 'Module'
console.log(Object.prototype.toString.call(myExports)); // [object Module]

// Symbol.toStringTag是一个内置的Symbol，可以用来做类型检测，可以定义类型、细化类型
