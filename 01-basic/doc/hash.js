function createHash() {
  return require('crypto').createHash('md5'); // 创建一个hash对象
}

const depModule1 = 'depModule1';
const depModule2 = 'depModule2';

const entry1 = `require("${depModule1}")`; // entry1入口文件，依赖depModule1
const entry2 = `require("${depModule2}")`; // entry2入口文件，依赖depModule2

// 两个入口文件
const entry = {
  entry1,
  entry2,
};

// 如果使用hash，那么它将是工程级别，没修改一个文件，所有的文件名都会发生改变
const hash = createHash()
  .update(entry1)
  .update(entry2)
  .update(depModule1)
  .update(depModule2)
  .digest('hex');

console.log('hash: ', hash); // hash:  f038bdaed39f4d8061b9c99d61c6bb78
// hash 与所有模块都有关系，只要有一个发生改变，hash都会发生改变

// chunkhash 会根据不同的入口文件，进行依赖文件解析，构建对应的hash值
// 修改 depModule1的内容，entry1ChunkHash发生改变，entry2ChunkHash不变
const entry1ChunkHash = createHash()
  .update(entry1)
  .update(depModule1)
  .digest('hex');
console.log('entry1ChunkHash: ', entry1ChunkHash); // entry1ChunkHash:  080984c6466ddb322e070af31ad4aa88

const entry2ChunkHash = createHash()
  .update(entry1)
  .update(depModule1)
  .digest('hex');
console.log('entry2ChunkHash: ', entry2ChunkHash); // entry1ChunkHash:  080984c6466ddb322e070af31ad4aa88

// contenthash 内容hash。只要内容没有改变，hash值就不会变
const file1Content = entry1 + depModule1;
const file1Hash = createHash()
  .update(file1Content)
  .digest('hex');
console.log('file1Hash: ', file1Hash); // file1Hash:  080984c6466ddb322e070af31ad4aa88

const file2Content = entry1 + depModule1;
const file2Hash = createHash()
  .update(file2Content)
  .digest('hex');
console.log('file2Hash: ', file2Hash); // file2Hash:  080984c6466ddb322e070af31ad4aa88