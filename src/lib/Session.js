
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
  constructor() {
    this.tokens = {};
    this.loadFromFile();
  }

  isValid() {
    const tuple = this.getTuple();
    if (!tuple) { return false; }

    const expires = new Date(tuple.expires);
    const current = new Date();

    return (expires > current);
  }

  getToken(login = 'default') {
    return this.tokens[login].token;
  }

  setToken(_token, login = 'default') {
    this.addToken(login, _token);
  }

  getTuple(login = 'default') {
    return this.tokens[login] || false;
  }

  addToken(login = 'default', token) {
    const id = login;
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + global.Config.expires);

    this.tokens[id] = {
      token,
      expires,
    };

    this.exportToFile();
  }

  remToken(login) {
    const id = login;

    if (this.tokens && this.tokens[id]) {
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
