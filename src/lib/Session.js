
const fs = require('fs');
const path = require('path');

const CACHE_FOLDER = path.join(__dirname, '../../', '.tmp');
const CACHE_PATH = `${CACHE_FOLDER}/freeipa.cookie.json`;

/**
 * This class handle the credentials of the freeipa request, also verifies if the app has an
 * active token. If the token is not valid or will be expiring soon it should request a new one
 * as return everything as a promise.
 * @constructor
 */
module.exports = class Session {
  constructor(expires) {
    this.tokens = {};
    this.defaultExpires = expires;

    this.loadFromFile();
  }

  isValid(login) {
    const tuple = this.getTuple(login);

    if (!tuple) { return false; }

    const expires = new Date(tuple.expires);
    const current = new Date();

    return (expires > current);
  }

  getTuple(login = 'default') {
    const id = Buffer.from(login).toString('base64');

    return this.tokens[id] || false;
  }

  addToken(login, token) {
    const id = Buffer.from(login).toString('base64');

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + this.defaultExpires);

    this.tokens[id] = {
      token,
      expires,
    };

    this.exportToFile();
  }

  remToken(login) {
    if (this.tokens[id]) {
      const id = Buffer.from(login).toString('base64');
      delete this.tokens[id];

      this.exportToFile();
    }
  }

  exportToFile() {
    if (!fs.existsSync(CACHE_FOLDER)) {
      fs.mkdirSync(CACHE_FOLDER);
    }
    fs.writeFileSync(CACHE_PATH, JSON.stringify(this.tokens));
  }

  loadFromFile() {
    if (fs.existsSync(CACHE_PATH)) {
      const cache = JSON.parse(fs.readFileSync(CACHE_PATH));
      this.tokens = cache;
    }
  }
};
