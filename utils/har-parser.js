const fs = require('fs');

const outputFile = 'har-express.js';

const harData = JSON.parse(fs.readFileSync('stubs/hars/login-request.har', { encoding: 'utf8' }));

// request = { method, url }
// response = { headers, content }
const initial = [{ request: {}, response: {} }];

const model = harData.log.entries.reduce((acc, curr) => {
  const { request, response } = curr;
  acc.push({ request, response });
  return acc;
}, initial);

let isInitialWrite = true;

model.forEach((rr) => {
  // write out an express method and response
  if (rr.request && rr.request.method) {
    const method = rr.request.method.toLowerCase();
    const path = rr.request.url;
    const response = JSON.stringify(rr.response.content.text, null, 2);
    let output = [
      `app.${method}('${path}', (req, res) => {`,
      ` res.send(${response});`,
      `});`,
    ].join('\n');
    output += '\n';
    if (isInitialWrite === true) {
      fs.writeFileSync(outputFile, output, 'utf8');
      isInitialWrite = false;
    } else {
      fs.appendFileSync(outputFile, output);
    }
  }
});
