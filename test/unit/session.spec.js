
const ipa = require('../../src/freeipa');

const fs = require('fs');

const CACHE_FOLDER = global.fx.config.cacheFolder;
const CACHE_PATH = `${CACHE_FOLDER}/freeipa.cookie.json`;

const Session = require('../../src/lib/Session');

const FAKE_DATE = new Date().getTime();
const FAKE_TOKEN = `ipa_session=MagBearerToken=ve9ft7if3SCZm6kJM%2bVzytBkEDR61TDitzc4W90PPe%2bhaGNl%2fw5UMwEdCiaxCz54E56N0Y9nDvt2FmTDMyXGmwmdPgyr7gvIh0i8ewKsoQkYE8T%2bR0Si63bS5z1UZ0fzKBtasWtsXbUd2m3hG%2fM4Fs29LM%2bzL7wyzRlk8wl9ca8Anvj5Dwe8N3cJXNK77kBs7OZc7fja5BDN7PlKRGmU%2fg%3d%3d;path=/ipa;httponly;expires=${FAKE_DATE};secure;`;
const FAKE_TOKEN45 = 'ipa_session=MagBearerToken=ve9ft7if3SCZm6kJM%2bVzytBkEDR61TDitzc4W90PPe%2bhaGNl%2fw5UMwEdCiaxCz54E56N0Y9nDvt2FmTDMyXGmwmdPgyr7gvIh0i8ewKsoQkYE8T%2bR0Si63bS5z1UZ0fzKBtasWtsXbUd2m3hG%2fM4Fs29LM%2bzL7wyzRlk8wl9ca8Anvj5Dwe8N3cJXNK77kBs7OZc7fja5BDN7PlKRGmU%2fg%3d%3d;path=/ipa;httponly;secure;';
const FUTURE_FAKE_DATE = new Date((new Date()).getTime() + (10 * 86400000)).getTime();
const FUTURE_FAKE_TOKEN = `ipa_session=MagBearerToken=ve9ft7if3SCZm6kJM%2bVzytBkEDR61TDitzc4W90PPe%2bhaGNl%2fw5UMwEdCiaxCz54E56N0Y9nDvt2FmTDMyXGmwmdPgyr7gvIh0i8ewKsoQkYE8T%2bR0Si63bS5z1UZ0fzKBtasWtsXbUd2m3hG%2fM4Fs29LM%2bzL7wyzRlk8wl9ca8Anvj5Dwe8N3cJXNK77kBs7OZc7fja5BDN7PlKRGmU%2fg%3d%3d;path=/ipa;httponly;expires=${FUTURE_FAKE_DATE};secure;`;

describe('Session Token tests', () => {
  beforeEach(() => {
    if (fs.existsSync(CACHE_PATH)) { fs.unlinkSync(CACHE_PATH); }
    if (fs.existsSync(CACHE_FOLDER)) { fs.rmdirSync(CACHE_FOLDER); }
    ipa.configure(global.fx.config);
  });

  afterEach(() => {
    if (fs.existsSync(CACHE_PATH)) { fs.unlinkSync(CACHE_PATH); }
    if (fs.existsSync(CACHE_FOLDER)) { fs.rmdirSync(CACHE_FOLDER); }
  });

  it('should be empty and invalid', () => {
    const session = new Session(global.fx.config);

    expect(session.tokens).to.be.empty;
    expect(session.isValid('default')).to.be.false;
  });

  it('should have token not empty', () => {
    const session = new Session(global.fx.config);
    session.addToken('default', FAKE_TOKEN);
    expect(session.tokens).to.not.be.empty;
  });

  it('should use 4.4 prior validation - valid', () => {
    const session = new Session(global.fx.config);
    session.addToken('default', FUTURE_FAKE_TOKEN);

    expect(session.isValid('default')).to.be.true;
  });

  it('should use 4.5 validation - valid', () => {
    const session = new Session(global.fx.config);
    session.addToken('default', FAKE_TOKEN45);
    expect(session.isValid('default')).to.be.true;
  });

  it('should create cache', () => {
    expect(fs.existsSync(CACHE_FOLDER)).to.be.false;
    const session = new Session(global.fx.config);
    session.addToken('default', FAKE_TOKEN);
    expect(fs.existsSync(CACHE_FOLDER)).to.be.true;
    expect(fs.existsSync(CACHE_PATH)).to.be.true;
  });

  it('should use cache token', () => {
    const session = new Session(global.fx.config);
    session.addToken('default', FAKE_TOKEN);
    session2 = new Session(global.fx.config);

    expect(session2.tokens).to.not.be.empty;
  });

  it('should have more than one token', () => {
    const session = new Session(global.fx.config);
    session.addToken('default', FAKE_TOKEN);
    session.addToken('default2', FAKE_TOKEN);
    session.addToken('default3', FAKE_TOKEN);

    expect(Object.keys(session.tokens).length).to.be.above(2);
  });

  it('should remove one cached token', () => {
    const session = new Session(global.fx.config);
    session.addToken('default', FAKE_TOKEN);
    session.addToken('default2', FAKE_TOKEN);

    session.remToken('default2');
    expect(Object.keys(session.tokens).length).to.be.eql(1);
  });

  it('user token should be unique', () => {
    const session = new Session(global.fx.config);
    session.addToken('default', FAKE_TOKEN);
    session.addToken('default', FAKE_TOKEN);

    expect(Object.keys(session.tokens).length).to.be.eql(1);
  });

  it('should remove token that does not exit', () => {
    const session = new Session(global.fx.config);
    session.remToken('default', FAKE_TOKEN);

    expect(Object.keys(session.tokens).length).to.be.eql(0);
  });

  it('should get a tuple', () => {
    const session = new Session(global.fx.config);
    session.addToken('default', FAKE_TOKEN);
    const r = session.getTuple('default');
    expect(r).to.exist;
  });

  it('should get a tuple but returns false', () => {
    const session = new Session(global.fx.config);
    const r = session.getTuple('default');

    expect(r).to.be.false;
  });

  it('should be valid 1 token', () => {
    const session = new Session(global.fx.config);
    session.addToken('default', FAKE_TOKEN);
    expect(Object.keys(session.tokens).length).to.be.eql(1);
  });

  it('should be invalid', () => {
    const Config = global.fx.config;
    Config.expires = 0;

    const session = new Session(Config);
    session.addToken('default', FAKE_TOKEN);
    setTimeout(() => {
      expect(session.isValid('default')).to.be.false;
    }, 3000);
  }).timeout(5000);

  it('should be in /tmp', () => {
    const Config = global.fx.config;
    Config.cacheFolder = '/tmp';

    const session = new Session(Config);
    session.addToken('default', FAKE_TOKEN);

    const cachePath = `${Config.cacheFolder}/freeipa.cookie.json`;
    expect(fs.existsSync(cachePath)).to.be.true;
  });
});
