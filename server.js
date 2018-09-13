const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const args = require('minimist')(process.argv);

const usage = `
  Usage: node server.js --filename=<har-filename> [--port=<port>]
`;

if (args.filename === undefined) {
  console.log(usage);
  process.exit(1);
}

const harname = args.filename.endsWith('.har') ? args.filename : `${args.filename}.har`;
const harData = JSON.parse(fs.readFileSync(`__hars__/${harname}`, { encoding: 'utf8' }));

const app = express();
app.disable('etag');
app.use(bodyParser.json());
app.use(
  session({
    secret: 'abc123',
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
  })
);

const getSuccessLoginEntry = () => {
  const successLoginEntry = harData.log.entries.find((entry) => {
    if (
      entry.request &&
      entry.request.method.toLowerCase() === 'post' &&
      entry.request.url.includes('/api/login') &&
      entry.response.status === 200
    ) {
      return true;
    }
    return false;
  });
  return successLoginEntry;
}

const getResponseData = (method, req) => {
  const endpointEntry = harData.log.entries.find((entry) => {
    if (
      entry.request &&
      entry.request.method.toLowerCase() === method &&
      entry.request.url.includes(req.path)
    ) {
      return true;
    }
    return false;
  });
  if (endpointEntry !== undefined) {
    return JSON.parse(endpointEntry.response.content.text);
  }
  return {};
};

app.get('/api/login', (req, res) => {
  if (req.session.isLoggedIn) {
    const successLoginEntry = getSuccessLoginEntry();
    res.send(successLoginEntry.response.content.text);
  } else {
    res.status(401);
    res.send({ errors: [{ reason: 'Not authenticated', message: 'Authentication needed' }] });
  }
});

app.post('/api/login', (req, res) => {
  req.session.isLoggedIn = true;
  const successLoginEntry = getSuccessLoginEntry();
  res.send(successLoginEntry.response.content.text);
});

app.get('/*', (req, res) => {
  const data = getResponseData('get', req);
  res.send(data);
});

app.post('/*', (req, res) => {
  const data = getResponseData('post', req);
  res.send(data);
});

app.put('/*', (req, res) => {
  const data = getResponseData('put', req);
  res.send(data);
});

app.delete('/*', (req, res) => {
  const data = getResponseData('delete', req);
  res.send(data);
});

app.listen(args.port || 4242);
