
const { _extend } = require('util');
const qs = require('querystring');

const Session = require('./Session');
const Request = require('./Request');

const URL_SESSION = '/ipa/session';
const URL_LOGIN = '/login_password';
const URL_JSON = '/json';

module.exports = class RequestBuilder {
  /**
   * This class handle the requests based on method,args,options.
   * Also returns all request using promises.
   * @constructor
   * @param {string} method - The method that it should call, for example, user_find.
   * @param {array} args - Freeipa argument to send.
   * @param {array} options - Freeipa options to send.
   */
  constructor(method, args, options, config) {
    if (!method || !args || !options || !config) {
      return Promise.resolve({ error: 'FREEIPA.NOARGS', desc: 'Blank args not possible for this type of request' });
    }

    this.method = method;
    this.args = args;
    this.options = options;
    this.config = config;
    this.session = new Session(this.config.expires);

    return this.getSession().then((result) => {
      if (result !== 'cache') { this.session.addToken(this.config.auth.user, result); }

      return this.getRequest();
    });
  }

  /**
   * This make HTTP/HTTPS request and return a promise without using 3rd party libs.
   * This is for internal use only, should not be used by other modules.
   * @param {json} params - Freeipa params to send.
   */
  call(endpoint, params) {
    const opts = this.getOpts(endpoint, params);

    return new Request(opts);
  }

  /**
   * Gets a new session token to make some new requests.
   */
  getSession() {
    if (this.session.isValid(this.config.auth.user)) {
      return Promise.resolve('cache');
    }
    const loginArgs = { user: this.config.auth.user, password: this.config.auth.pass };

    return this.call(URL_LOGIN, loginArgs);
  }


  /**
   * Gets a promise using json request.
   * @param {string} method - The method that it should call, for example, user_find.
   * @param {array} args - Freeipa argument to send.
   * @param {array} options - Freeipa options to send.
   */
  getRequest() {
    const { method } = this;
    const defaultArgs = { method, params: [this.args, this.options] };

    return this.call(URL_JSON, defaultArgs);
  }

  /**
   * Builds one new request options based on its path.
   * @param {string} path - The method that it should call, for example, user_find.
   * @param {json} args - Freeipa params to send.
   */
  getOpts(path, args) {
    let data = null;
    const myArgs = args;

    // LOGIN_AUTH has a different behavior.
    if (path === URL_LOGIN) {
      data = qs.stringify(args);
    } else {
      myArgs.params[1] = _extend(myArgs.params[1], {
        version: this.config.client_version,
      });
      data = JSON.stringify(myArgs);
    }

    const reqOpts = {
      method: 'POST',
      host: this.config.server,
      path: URL_SESSION + path,
      ca: this.config.ca,
      headers: {
        accept: 'text/plain',
        'content-type': 'application/x-www-form-urlencoded',
        referer: `https://${this.config.server}/ipa`,
        'Content-Length': data.length,
      },
      rejectUnauthorized: this.config.rejectUnauthorized,
    };

    if (path !== URL_LOGIN) {
      reqOpts.headers = _extend(reqOpts.headers, {
        Cookie: this.session.getTuple(this.config.auth.user).token,
        accept: 'application/json',
        'content-type': 'application/json',
      });
    }

    return { reqOpts, data };
  }
};
