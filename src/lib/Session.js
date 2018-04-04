
const fs = require('fs');
const path = require('path');

const CACHE_FOLDER = path.join(__dirname, '../../', '.tmp');
const CACHE_PATH = `${CACHE_FOLDER}/cookie.json`;

/**
 * This class handle the credentials of the freeipa request, also verifies if the app has an
 * active token. If the token is not valid or will be expiring soon it should request a new one
 * as return everything as a promise.
 * @constructor
 */
module.exports = class Session {
  constructor() {
    if (fs.existsSync(CACHE_PATH)) {
      const cache = JSON.parse(fs.readFileSync(CACHE_PATH));
      this.token = cache.token;
    } else {
      this.token = '';
    }
  }

  isValid() {
    if (!this.token || !fs.existsSync(CACHE_PATH)) {
      return false;
    }

    let expires = new Date();
    const current = new Date();
    const expired = this.token.split(';')[3];

    if (expired.split('=')[1]) {
      expires.setTime(expired.split('=')[1]);
    } else {
      // Freeipa 4.5+
      const stats = fs.statSync(CACHE_PATH).mtime;
      expires = new Date(stats);

      expires.setMinutes(expires.getMinutes() + global.Config.expires);
    }

    return (expires >= current);
  }

  setToken(_token) {
    this.token = _token;

    if (!fs.existsSync(CACHE_FOLDER)) {
      fs.mkdirSync(CACHE_FOLDER);
    }
    fs.writeFileSync(CACHE_PATH, JSON.stringify({ token: _token }));
  }
};
