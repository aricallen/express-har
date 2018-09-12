const { Polly } = require('@pollyjs/core');
const XHRAdapter = require('@pollyjs/adapter-xhr');
const FetchAdapter = require('@pollyjs/adapter-fetch');
const RESTPersister = require('@pollyjs/persister-rest');
// const { registerExpressAPI } = require('@pollyjs/node-server');
// const express = require('express');
// const bodyParser = require('body-parser');
// const HarExpress = require('./har-express.js');

// const app = express();
// app.use(bodyParser.json());
// app.listen(4242);

/*
  Register the adapters and persisters we want to use. This way all future
  polly instances can access them by name.
*/
Polly.register(XHRAdapter);
Polly.register(FetchAdapter);
Polly.register(RESTPersister);

const polly = new Polly('Sign In', {
  adapters: ['xhr', 'fetch'],
  persister: 'rest',
});

const { server } = polly;
server.listen(4242);
