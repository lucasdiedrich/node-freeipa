const ipa = require('../../src/freeipa');
const sinon = require('sinon');

const userFind = sinon.spy(ipa, 'user_find');

const fs = require('fs');
const path = require('path');

const CACHE_FOLDER = path.join(__dirname, '../../', '.tmp');
const CACHE_PATH = `${CACHE_FOLDER}/freeipa.cookie.json`;

describe('Client tests', () => {
  beforeEach(() => {
    Session = null;
    if (fs.existsSync(CACHE_PATH)) { fs.unlinkSync(CACHE_PATH); }
    if (fs.existsSync(CACHE_FOLDER)) { fs.rmdirSync(CACHE_FOLDER); }
    ipa.configure(global.fx.config);
  });

  it('should the new client be defined', () => {
    expect(ipa.user_find).to.exist;
  });

  it('should call exists and be an function', () => {
    expect(ipa.call).to.be.an.instanceof(Function);
  });

  it('should call user_find redirect to new client', () => {
    ipa.configure(global.fx.config);

    ipa.call('user_find');
    expect(userFind.called).to.be.true;
  });
});
