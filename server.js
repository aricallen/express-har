const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');

const harData = JSON.parse(fs.readFileSync('__hars__/localhost.har', { encoding: 'utf8' }));

const app = express();
app.use(bodyParser.json());
app.use(
  session({
    secret: 'abc123',
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
  })
);

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
  const data = getResponseData('post', req);
  res.send(data);
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

app.listen(4242);
