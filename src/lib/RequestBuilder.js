const https = require('https');

const { _extend } = require('util');
const qs = require('querystring');
const Session = require('./Session');

const URL_SESSION = '/ipa/session';
const URL_LOGIN = '/login_password';
const URL_JSON = '/json';

let session = new Session();
let Config;

/**
 * Builds one new request options based on its path.
 * @param {string} path - The method that it should call, for example, user_find.
 * @param {json} args - Freeipa params to send.
 */
function requestOpts(path, args) {
  let data = null;
  const myArgs = args;

  // LOGIN_AUTH has a different behavior.
  if (path === URL_LOGIN) {
    data = qs.stringify(args);
  } else {
    myArgs.params[1] = _extend(myArgs.params[1], {
      version: Config.client_version,
    });
    data = JSON.stringify(myArgs);
  }

  const reqOpts = {
    method: 'POST',
    host: Config.server,
    path: URL_SESSION + path,
    ca: Config.ca,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/x-www-form-urlencoded',
      referer: `https://${Config.server}/ipa`,
      'Content-Length': data.length,
    },
    rejectUnauthorized: Config.rejectUnauthorized,
  };

  if (path !== URL_LOGIN) {
    reqOpts.headers = _extend(reqOpts.headers, {
      Cookie: session.token,
      accept: 'application/json',
      'content-type': 'application/json',
    });
  }

  return { reqOpts, data };
}

/**
 * This make HTTP/HTTPS request and return a promise without using 3rd party libs.
 * This is for internal use only, should not be used by other modules.
 * @param {string} method - The method that it should call, for example, user_find.
 * @param {json} params - Freeipa params to send.
 */
function call(method, params) {
  return new Promise((resolve, reject) => {
    if (!params) {
      reject(new Error('Freeipa: Blank args not possible for this type of request.'));
    }

    const opts = requestOpts(method, params);

    const req = https.request(opts.reqOpts, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (method === URL_LOGIN) {
          if (res.headers['set-cookie']) {
            resolve(res.headers['set-cookie'][0]);
          } else {
            reject(new Error('It wasn\'t possible to get the auth cookie, check your configs.'));
          }
        } else {
          try {
            const bodyParsed = JSON.parse(body);

            if ((!bodyParsed.error) &&
            bodyParsed.result &&
            bodyParsed.result.result &&
            (!Array.isArray(bodyParsed.result.result) ||
            (Array.isArray(bodyParsed.result.result) && bodyParsed.result.count > 0))) {
              resolve(bodyParsed.result.result);
            } else {
              resolve({ error: 'No data found.' });
            }
          } catch (error) {
            reject(error);
          }
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

/**
 * Gets a new session token to make some new requests.
 */
function getSession() {
  const loginArgs = { user: Config.auth.user, password: Config.auth.pass };

  return call(URL_LOGIN, loginArgs);
}

/**
 * Gets a promise using json request.
 * @param {string} method - The method that it should call, for example, user_find.
 * @param {array} args - Freeipa argument to send.
 * @param {array} options - Freeipa options to send.
 */
function getRequest(method, args, options) {
  const defaultArgs = { method, params: [args, options] };

  return call(URL_JSON, defaultArgs);
}

/**
 * This class handle the requests based on method,args,options.
 * Also returns all request using promises.
 * @constructor
 * @param {string} method - The method that it should call, for example, user_find.
 * @param {array} args - Freeipa argument to send.
 * @param {array} options - Freeipa options to send.
 */
module.exports.build = function build(method, args, options) {
  ({ Config } = global);

  if (!Config) {
    throw new Error('node-freeipa: The module was not configured correctly');
  }

  if (session.isValid()) {
    return getRequest(method, args, options);
  }

  return getSession().then((result) => {
    session = new Session(result);
    // console.log(session);
    return getRequest(method, args, options);
  });
};
