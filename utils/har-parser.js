const fs = require('fs');

const outputFile = 'har-express.js';

const harData = JSON.parse(fs.readFileSync('stubs/hars/login-request.har', { encoding: 'utf8' }));

// request = { method, url }
// response = { headers, content }
const initial = [{ request: {}, response: {} }];

const model = harData.log.entries.reduce((acc, curr) => {
  const request = {
    method: curr.request.method,
    url: curr.request.url,
  };
  const response = {
    headers: curr.response.headers,
    content: curr.response.content,
  };
  acc.push({ request, response });
  return acc;
}, initial);

model.forEach((rr) => {
  // write out an express method and response
  if (rr.request && rr.request.method) {
    const method = rr.request.method.toLowerCase();
    const path = rr.request.url;
    const response = JSON.stringify(rr.response.content, null, 2);
    const output = `app.${method}('${path}', () => (${response}));\n\n`;
    fs.appendFileSync(outputFile, output);
  }
});
