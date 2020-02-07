
const https = require('https');

const URL_LOGIN = '/login_password';
const FAILED_AUTH_PARSE = 'Unexpected token < in JSON at position 0';
module.exports = class Request {
  /**
   * Construct one new Request promise.
   * @constructor
   * @param {json} opts - The request options created by the builder.
   */
  constructor(opts) {
    this.opts = opts;
    return new Promise((resolve, reject) => {
      const req = this.getRequest(resolve, reject);

      req.on('error', (e) => {
        resolve({ error: 'FREEIPA.REQUEST_ERROR', desc: e.message });
      });

      if (opts.data) {
        req.write(opts.data);
      }

      req.end();
    });
  }

  /**
   * Return an request object to be used by the promise. This request is what
   * handles the data returned from Freeipa server.
   * @method
   * @param {function} resolve - Promise resolve.
   * @param {function} reject - Promise reject.
   */
  getRequest(resolve, reject) {
    return https.request(this.opts.reqOpts, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          // Handles login
          if (this.opts.reqOpts.path.endsWith(URL_LOGIN)) {
            if (res.headers['set-cookie']) {
              resolve(res.headers['set-cookie'][0]);
            } else {
              throw new Error('It wasn\'t possible to get the auth cookie.');
            }
          } else {
            const bodyParsed = JSON.parse(body);

            if (bodyParsed.error || !bodyParsed.result) {
              resolve({ error: bodyParsed.error });
            }

            if (bodyParsed.result.result &&
              (!Array.isArray(bodyParsed.result.result) ||
                (Array.isArray(bodyParsed.result.result) && bodyParsed.result.count > 0))) {
              resolve(bodyParsed.result.result);
            } else {
              resolve({ error: 'FREEIPA.NO_DATA', detail: bodyParsed.result });
            }
          }
        } catch (e) {
          resolve({
            error: e.message.includes(FAILED_AUTH_PARSE) ?
              'FREEIPA.AUTH_ERROR' : 'FREEIPA.UNHANDLED_ERROR',
            desc: e.message,
          });
        }
      });
    });
  }
};
