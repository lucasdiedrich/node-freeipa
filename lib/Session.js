
const fs = require('fs');
const path = require('path');

const CACHE_FOLDER = path.join(__dirname, '..', 'cache');
const CACHE_PATH = `${CACHE_FOLDER}/cookie.json`;

/**
 * This class handle the credentials of the freeipa request, also verifies if the app has an
 * active token. If the token is not valid or will be expiring soon it should request a new one
 * as return everything as a promise.
 * @constructor
 * @param {string} _token - Acess token provided by Freeipa Server.
 */
module.exports = function Main(_token) {
  const self = this;

  if (_token) {
    self.token = _token;

    if (!fs.existsSync(CACHE_FOLDER)) {
      fs.mkdirSync(CACHE_FOLDER);
    }

    try {
      fs.writeFileSync(CACHE_PATH, JSON.stringify({ token: _token }));
    } catch (error) {
      throw new Error(error);
    }
  } else {
    try {
      const cachedToken = JSON.parse(fs.readFileSync(CACHE_PATH));

      if (cachedToken.token) {
        self.token = cachedToken.token;
      }
    } catch (error) {
      self.token = '';
    }
  }

  self.isValid = () => {
    if (!self.token) {
      return false;
    }

    const expires = new Date(self.token.split(';')[3].split('=')[1]);
    const current = new Date();

    return expires > current;
  };

  return self;
};
