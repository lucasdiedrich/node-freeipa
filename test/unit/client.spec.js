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
});
