const ipa = require('../../src/freeipa');
const Request = require('../../src/lib/Request');

const fs = require('fs');
const path = require('path');

const CACHE_FOLDER = path.join(__dirname, '../../', '.tmp');
const CACHE_PATH = `${CACHE_FOLDER}/freeipa.cookie.json`;

const INVALID_LOGIN_JSON = {
  reqOpts:
  {
    method: 'POST',
    host: global.fx.config.server,
    path: '/ipa/session/login_password',
    ca: false,
    headers:
     {
       accept: 'text/plain',
       'content-type': 'application/x-www-form-urlencoded',
       referer: `https://${global.fx.config.server}/ipa`,
       'Content-Length': 37,
     },
    rejectUnauthorized: false,
  },
  data: 'user=NANANANA&password=YEAH',
};

const INVALID_REQUEST = {
  reqOpts:
  {
    method: 'POST',
    host: global.fx.config.server,
    path: '/ipa/session/json',
    ca: false,
    headers:
     {
       accept: 'application/json',
       'content-type': 'application/json',
       referer: `https://${global.fx.config.server}/ipa`,
       'Content-Length': 52,
       Cookie: 'ipa_session=MagBearerToken=mbtgRVpd%AD%2bXCA%3d%3d;path=/ipa;httponly;secure;',
     },
    rejectUnauthorized: false,
  },
  data: '{"method":"env","params":[["nananannana"],{"version":"2.156"}]}',
};

describe('Request Tests', () => {
  beforeEach(() => {
    if (fs.existsSync(CACHE_PATH)) { fs.unlinkSync(CACHE_PATH); }
    if (fs.existsSync(CACHE_FOLDER)) { fs.rmdirSync(CACHE_FOLDER); }
    ipa.configure(global.fx.config);
  });

  it('should throw invalid request process', () => {
    new Request({}).catch((err) => {
      expect(err.message).to.equal('Freeipa: problem with request: connect ECONNREFUSED 127.0.0.1:443');
    });
  });

  it('should throw no whay to get auth process', () => {
    new Request(INVALID_LOGIN_JSON).catch((err) => {
      expect(err).to.equal("Freeipa: It wasn't possible to get the auth cookie.");
    });
  });

  it('should throw invalid response', () => {
    new Request(INVALID_REQUEST).then((result) => {
      expect(result.error).to.equal('FREEIPA.AUTH_ERROR');
    });
  });
});
