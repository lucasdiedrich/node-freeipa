
const ipa = require('../../src/freeipa');

const fs = require('fs');
const path = require('path');

const CACHE_FOLDER = path.join(__dirname, '../../', '.tmp');
const CACHE_PATH = `${CACHE_FOLDER}/freeipa.cookie.json`;

const SessionCl = require('../../src/lib/Session');

const FAKE_DATE = new Date().getTime();
const FAKE_TOKEN = `ipa_session=MagBearerToken=ve9ft7if3SCZm6kJM%2bVzytBkEDR61TDitzc4W90PPe%2bhaGNl%2fw5UMwEdCiaxCz54E56N0Y9nDvt2FmTDMyXGmwmdPgyr7gvIh0i8ewKsoQkYE8T%2bR0Si63bS5z1UZ0fzKBtasWtsXbUd2m3hG%2fM4Fs29LM%2bzL7wyzRlk8wl9ca8Anvj5Dwe8N3cJXNK77kBs7OZc7fja5BDN7PlKRGmU%2fg%3d%3d;path=/ipa;httponly;expires=${FAKE_DATE};secure;`;
const FAKE_TOKEN45 = 'ipa_session=MagBearerToken=ve9ft7if3SCZm6kJM%2bVzytBkEDR61TDitzc4W90PPe%2bhaGNl%2fw5UMwEdCiaxCz54E56N0Y9nDvt2FmTDMyXGmwmdPgyr7gvIh0i8ewKsoQkYE8T%2bR0Si63bS5z1UZ0fzKBtasWtsXbUd2m3hG%2fM4Fs29LM%2bzL7wyzRlk8wl9ca8Anvj5Dwe8N3cJXNK77kBs7OZc7fja5BDN7PlKRGmU%2fg%3d%3d;path=/ipa;httponly;secure;';
const FUTURE_FAKE_DATE = new Date((new Date()).getTime() + (10 * 86400000)).getTime();
const FUTURE_FAKE_TOKEN = `ipa_session=MagBearerToken=ve9ft7if3SCZm6kJM%2bVzytBkEDR61TDitzc4W90PPe%2bhaGNl%2fw5UMwEdCiaxCz54E56N0Y9nDvt2FmTDMyXGmwmdPgyr7gvIh0i8ewKsoQkYE8T%2bR0Si63bS5z1UZ0fzKBtasWtsXbUd2m3hG%2fM4Fs29LM%2bzL7wyzRlk8wl9ca8Anvj5Dwe8N3cJXNK77kBs7OZc7fja5BDN7PlKRGmU%2fg%3d%3d;path=/ipa;httponly;expires=${FUTURE_FAKE_DATE};secure;`;

let Session = null;

describe('Session Token tests', () => {
  beforeEach(() => {
    Session = null;
    try {
      fs.unlinkSync(CACHE_PATH);
      fs.rmdirSync(CACHE_FOLDER);
      ipa.configure(global.fx.config);
    } catch (error) { }
  });

  it('should be empty and invalid', () => {
    Session = new SessionCl();

    expect(Session.token).to.be.empty;
    expect(Session.isValid()).to.be.false;
  });

  it('should have token not empty', () => {
    Session = new SessionCl();
    Session.setToken(FAKE_TOKEN);
    expect(Session.token).to.not.be.empty;
  });

  it('should use 4.4 prior validation - invalid', () => {
    Session = new SessionCl();
    Session.setToken(FAKE_TOKEN);
    expect(Session.isValid()).to.be.false;
  });

  it('should use 4.4 prior validation - valid', () => {
    Session = new SessionCl(FUTURE_FAKE_TOKEN);
    Session.setToken(FUTURE_FAKE_TOKEN);

    expect(Session.isValid()).to.be.true;
  });

  it('should use 4.5 validation - valid', () => {
    Session = new SessionCl();
    Session.setToken(FAKE_TOKEN45);
    expect(Session.isValid()).to.be.true;
  });

  it('should create cache', () => {
    expect(fs.existsSync(CACHE_FOLDER)).to.be.false;
    Session = new SessionCl(FAKE_TOKEN);
    Session.setToken(FAKE_TOKEN);
    expect(fs.existsSync(CACHE_FOLDER)).to.be.true;
    expect(fs.existsSync(CACHE_PATH)).to.be.true;
  });

  it('should use cache token', () => {
    Session = new SessionCl();
    Session.setToken(FAKE_TOKEN);
    Session2 = new SessionCl();
    expect(Session2.token).to.not.be.empty;
  });
});
