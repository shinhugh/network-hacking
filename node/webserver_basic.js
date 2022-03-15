const http = require('http');

const server = http.createServer((req, res) => {
  console.log('HTTP request received from: ' + req.socket.remoteAddress);
  res.writeHead(200);
  res.end('Hello world!');
}).listen(80, '10.0.0.1');

console.log('Web server listening on port 80');