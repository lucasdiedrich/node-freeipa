
const Session = require('../../src/lib/Session');
const ipa = require('../../src/freeipa');

const fs = require('fs');
const path = require('path');

const CACHE_FOLDER = path.join(__dirname, '../../', '.tmp');
const CACHE_PATH = `${CACHE_FOLDER}/cookie.json`;

const FAKE_DATE = new Date().getTime();
const FAKE_TOKEN = `ipa_session=MagBearerToken=ve9ft7if3SCZm6kJM%2bVzytBkEDR61TDitzc4W90PPe%2bhaGNl%2fw5UMwEdCiaxCz54E56N0Y9nDvt2FmTDMyXGmwmdPgyr7gvIh0i8ewKsoQkYE8T%2bR0Si63bS5z1UZ0fzKBtasWtsXbUd2m3hG%2fM4Fs29LM%2bzL7wyzRlk8wl9ca8Anvj5Dwe8N3cJXNK77kBs7OZc7fja5BDN7PlKRGmU%2fg%3d%3d;path=/ipa;httponly;expires=${FAKE_DATE};secure;`;
const FAKE_TOKEN45 = 'ipa_session=MagBearerToken=ve9ft7if3SCZm6kJM%2bVzytBkEDR61TDitzc4W90PPe%2bhaGNl%2fw5UMwEdCiaxCz54E56N0Y9nDvt2FmTDMyXGmwmdPgyr7gvIh0i8ewKsoQkYE8T%2bR0Si63bS5z1UZ0fzKBtasWtsXbUd2m3hG%2fM4Fs29LM%2bzL7wyzRlk8wl9ca8Anvj5Dwe8N3cJXNK77kBs7OZc7fja5BDN7PlKRGmU%2fg%3d%3d;path=/ipa;httponly;secure;';
const FUTURE_FAKE_DATE = new Date((new Date()).getTime() + (10 * 86400000)).getTime();
const FUTURE_FAKE_TOKEN = `ipa_session=MagBearerToken=ve9ft7if3SCZm6kJM%2bVzytBkEDR61TDitzc4W90PPe%2bhaGNl%2fw5UMwEdCiaxCz54E56N0Y9nDvt2FmTDMyXGmwmdPgyr7gvIh0i8ewKsoQkYE8T%2bR0Si63bS5z1UZ0fzKBtasWtsXbUd2m3hG%2fM4Fs29LM%2bzL7wyzRlk8wl9ca8Anvj5Dwe8N3cJXNK77kBs7OZc7fja5BDN7PlKRGmU%2fg%3d%3d;path=/ipa;httponly;expires=${FUTURE_FAKE_DATE};secure;`;

describe('Session Token tests', () => {
  let session = null;

  beforeEach(() => {
    session = null;
    try {
      fs.unlinkSync(CACHE_PATH);
      fs.rmdirSync(CACHE_FOLDER);
      ipa.configure(global.fx.config);
    } catch (error) { }
  });

  it('should be empty and invalid', () => {
    session = new Session();

    expect(session.token).to.be.empty;
    expect(session.isValid()).to.be.false;
  });

  it('should have token not empty', () => {
    session = new Session(FAKE_TOKEN);
    expect(session.token).to.not.be.empty;
  });

  it('should use 4.4 prior validation - invalid', () => {
    session = new Session(FAKE_TOKEN);
    expect(session.isValid()).to.be.false;
  });

  it('should use 4.4 prior validation - valid', () => {
    session = new Session(FUTURE_FAKE_TOKEN);
    expect(session.isValid()).to.be.true;
  });

  it('should use 4.5 validation - valid', () => {
    session = new Session(FAKE_TOKEN45);
    expect(session.isValid()).to.be.true;
  });

  it('should create cache', () => {
    expect(fs.existsSync(CACHE_FOLDER)).to.be.false;
    session = new Session(FAKE_TOKEN);
    expect(fs.existsSync(CACHE_FOLDER)).to.be.true;
    expect(fs.existsSync(CACHE_PATH)).to.be.true;
  });

  it('should use cache token', () => {
    session = new Session(FAKE_TOKEN);
    session2 = new Session();
    expect(session2.token).to.not.be.empty;
  });
});
