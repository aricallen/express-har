const express = require('express');
const bodyParser = require('body-parser');
const { customerSettings, applicationSettings } = require('./stubs/index.js');

const app = express();
app.use(bodyParser.json());

app.get('customerSettings', () => customerSettings);
app.get('applicationSettings', () => applicationSettings);

app.listen(4242);
