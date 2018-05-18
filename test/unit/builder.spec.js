const ipa = require('../../src/freeipa');
const RequestBuilder = require('../../src/lib/RequestBuilder');

const fs = require('fs');
const path = require('path');

const CACHE_FOLDER = path.join(__dirname, '../../', '.tmp');
const CACHE_PATH = `${CACHE_FOLDER}/freeipa.cookie.json`;

describe('Request Builder Tests', () => {
  beforeEach(() => {
    if (fs.existsSync(CACHE_PATH)) { fs.unlinkSync(CACHE_PATH); }
    if (fs.existsSync(CACHE_FOLDER)) { fs.rmdirSync(CACHE_FOLDER); }
    ipa.configure(global.fx.config);
  });

  it('should call user_find and resolv', (done) => {
    ipa.user_find(['nousershouldhavethisname']).then(() => {
      done();
    });
  }).timeout(10000);

  it('should reject the build process', () => {
    new RequestBuilder().catch((err) => {
      expect(err.message).to.equal('Freeipa: Blank args not possible for this type of request');
    });
  });

  it('should call env and resolv', () => {
    ipa.env().then((result) => {
      expect(result).to.not.be.null;
    });
  }).timeout(6000);

  it('should use cache session', (done) => {
    ipa.env().then(() => {
      ipa.env().then(() => {
        done();
      });
    });
  }).timeout(6000);
});
