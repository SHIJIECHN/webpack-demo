module.exports = {
  rules: [
    {
      test: /\.js$/,
      enforce: 'pre', // 一定先执行
      use: ['pre-loader1', 'pre-loader2']
    },
    {
      test: /\.js$/,
      use: ['normal-loader1', 'normal-loader2']
    },
    {
      test: /\.js$/,
      enforce: 'post', // post webpack保证一定是最后执行的
      use: ['post-loader1', 'post-loader2']
    },
  ]
}