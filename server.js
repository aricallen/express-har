const express = require('express');
const bodyParser = require('body-parser');
const HarExpress = require('./har-express.js');

const app = express();
app.use(bodyParser.json());

HarExpress(app);

app.listen(4242);
