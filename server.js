const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const args = require('minimist')(process.argv);
const HookupCustomEndpoints = require('./custom-endpoints.js');

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
    cookie: {},
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

HookupCustomEndpoints(app, harData);

app.get('/*', (req, res) => {
  const data = getResponseData('get', req);
  res.send(data);
});

app.post('/*', (req, res) => {
  const data = getResponseData('post', req);
  res.send(data || req.body);
});

app.put('/*', (req, res) => {
  const data = getResponseData('put', req);
  res.send(data || req.body);
});

app.delete('/*', (req, res) => {
  const data = getResponseData('delete', req);
  res.send(data || req.body);
});

app.listen(args.port || 4242);
