const ipa = require('../../src/freeipa');
const sinon = require('sinon');
const RequestBuilder = require('../../src/lib/RequestBuilder');

const build = sinon.spy(RequestBuilder, 'build');

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
    ipa.user_find().then(() => {
      done();
    });
  }).timeout(10000);

  it('should call build method', () => {
    ipa.json_metadata();
    expect(build.called).to.be.true;
  });

  it('should throw an error - invalid config', () => {
    global.Config = null;
    ipa.json_metadata().catch((e) => {
      expect(e.message).to.equal('node-freeipa: The module was not configured correctly');
    });
  });
});
