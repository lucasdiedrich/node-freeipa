
const https = require('https');

const URL_LOGIN = '/login_password';

module.exports = class Request {
  constructor(method, params, opts) {
    return new Promise((resolve, reject) => {
      const req = https.request(opts.reqOpts, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            if (method === URL_LOGIN) {
              if (res.headers['set-cookie']) {
                resolve(res.headers['set-cookie'][0]);
              } else {
                throw new Error('It wasn\'t possible to get the auth cookie.');
              }
            } else {
              const bodyParsed = JSON.parse(body);

              if (bodyParsed.error) {
                resolve({ error: bodyParsed.error });
              }

              if (!bodyParsed.result) {
                resolve({
                  error: bodyParsed.error,
                  detail: bodyParsed.result,
                });
              }

              if (bodyParsed.result.result &&
              (!Array.isArray(bodyParsed.result.result) ||
              (Array.isArray(bodyParsed.result.result) && bodyParsed.result.count > 0))) {
                resolve(bodyParsed.result.result);
              } else {
                resolve({ error: 'No data found.', detail: bodyParsed.result.result });
              }
            }
          } catch (e) {
            reject(new Error(`Freeipa: problem with request: ${e.message}`));
          }
        });
      });

      req.on('error', (e) => {
        reject(new Error(`Freeipa: problem with request: ${e.message}`));
      });

      if (opts.data) {
        req.write(opts.data);
      }

      req.end();
    });
  }
};
