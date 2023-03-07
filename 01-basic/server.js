const http = require('http');

http.createServer((req, res) => {
  res.end(JSON.stringify([
    {
      name: 'zhufeng',
      age: 12,
    },
  ]));
}).listen(3333, () => {
  console.log('Welcome');
});
