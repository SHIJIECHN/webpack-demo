/**
 * 我需要向输出目录里多输出一个文件
 * 你得告诉 webpack你输出的文件名和文件内容
 */
const { RawSource } = require('webpack-sources');// 用来描述源代码的
class AssetsPlugin {
  apply(compiler) {
    /**
     * compiler代表总的编译对象
     * compilation代表一次编译对象
     * chunkAsset代码块资源
     * module一个文件对应一个模块
     * 从入口文件触发，它和它依赖的模块组成一个代码块，chunk.name=main
     * 一般来说一个chunk会生成一个assets，也就是一个资源文件 main.js
     */
    // compiler.hooks.compilation.tap('AssetsPlugion', (compilation) => {
    //   compilation.hooks.chunkAsset.tap('AssetsPlugin', (chunk, filename) => {
    //     console.log(chunk.name, filename); // main main.js
    //   })
    // })

    /**
     * 当所有的资源文件都准备就绪，准备写入硬盘的时候会触发这个钩子
     * 它是修改文件的最后机会
     */
    compiler.hooks.emit.tapAsync('AssetsPlugion', (compilation, callback) => {
      console.log(compilation.assets);
      let assetList = ``;
      for (let file in compilation.assets) {
        let source = compilation.assets[file].source();
        // console.log(file, source)
        assetList += `${file} ${source.length} bytes \r\n`;
      }
      // compilation.assets['asstes.md'] = {
      //   source() {
      //     return assetList;
      //   }
      // }
      compilation.assets['assets.md'] = new RawSource(assetList);
      callback();
    })
  }

}
module.exports = AssetsPlugin;