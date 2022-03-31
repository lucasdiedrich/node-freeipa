
const fs = require('fs');

module.exports = class Session {
  /**
   * Construct one new Session
   * @constructor
   * @param {Config} config - Configuration file using OPTs in initialization
   */
  constructor(config) {
    const { expires, cacheFolder } = config;
    this.tokens = {};
    this.defaultExpires = expires;

    this.CACHE_FOLDER = cacheFolder;
    this.CACHE_PATH = `${cacheFolder}/freeipa.cookie.json`;

    this.loadFromFile();
  }

  /**
   * Return true if the user login has an valid cookie inside the store.
   * @method
   * @param {string} login - The user plain login.
   */
  isValid(login) {
    const tuple = this.getTuple(login);

    if (!tuple) { return false; }

    const expires = new Date(tuple.expires);
    const current = new Date();

    if (expires <= current) {
      this.remToken(login);
    }

    return (expires > current);
  }

  /**
   * Return the user cookie if it have one or false if doesn't.
   * @method
   * @param {string} login - The user plain login.
   */
  getTuple(login) {
    const id = Buffer.from(login).toString('base64');

    return this.tokens[id] || false;
  }

  /**
   * Add an token to the store.
   * @method
   * @param {string} login - The user plain login.
   * @param {string} token - The plain token returned from freeipa server.
   */
  addToken(login, token) {
    const id = Buffer.from(login).toString('base64');

    if (this.tokens[id]) {
      this.remToken(login);
    }

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + this.defaultExpires);

    this.tokens[id] = {
      token,
      expires,
    };

    this.exportToFile();
  }

  /**
   * Remove an token from the store.
   * @method
   * @param {string} login - The user plain login.
   */
  remToken(login) {
    const id = Buffer.from(login).toString('base64');
    if (this.tokens[id]) {
      delete this.tokens[id];

      this.exportToFile();
    }
  }

  /**
   * Return all tokens.
   * @method
   */
  getAllTokens() {
    return this.tokens();
  }

  /**
   * Export the current json object to the file store.
   * @method
   */
  exportToFile() {
    if (!fs.existsSync(this.CACHE_FOLDER)) {
      fs.mkdirSync(this.CACHE_FOLDER);
    }
    fs.writeFileSync(this.CACHE_PATH, JSON.stringify(this.tokens));
  }

  /**
   * Import the current json object to the file store.
   * @method
   */
  loadFromFile() {
    if (fs.existsSync(this.CACHE_PATH)) {
      const cache = JSON.parse(fs.readFileSync(this.CACHE_PATH));
      this.tokens = cache;
    }
  }
};
