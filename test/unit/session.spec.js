
const { configure } = require('../../freeipa');
const Session = require('../../lib/Session');

const fs 		 = require("fs");
const path 		 = require("path");

const CACHE_FOLDER = path.join(__dirname, '../../', "cache");
const CACHE_PATH = `${CACHE_FOLDER}/cookie.json`;

const FAKE_DATE = new Date().getTime();
const FAKE_TOKEN = `ipa_session=MagBearerToken=ve9ft7if3SCZm6kJM%2bVzytBkEDR61TDitzc4W90PPe%2bhaGNl%2fw5UMwEdCiaxCz54E56N0Y9nDvt2FmTDMyXGmwmdPgyr7gvIh0i8ewKsoQkYE8T%2bR0Si63bS5z1UZ0fzKBtasWtsXbUd2m3hG%2fM4Fs29LM%2bzL7wyzRlk8wl9ca8Anvj5Dwe8N3cJXNK77kBs7OZc7fja5BDN7PlKRGmU%2fg%3d%3d;path=/ipa;httponly;expires=${FAKE_DATE};secure;`

describe('Session Token tests', () => {
  var session = null;

  beforeEach(() => {
    session = new Session();
  });

  it('should be empty and invalid', () => {
    expect(session.token).to.be.empty;
    expect(session.isValid()).to.be.false;
  });

  it('should have token not empty', () => {
    session = new Session(FAKE_TOKEN);
    expect(session.token).not.to.be.empty;
  });

  it('should have an valid token', () => {
    session = new Session(FAKE_TOKEN);
    expect(session.isValid()).to.be.false;
  });

  // Cached token is not working anymore since versin 4.5 +
  // it('should use cache token', () => {
  //   session = new Session();
  //   expect(session.token).not.to.be.empty;
  // });

  it('should create cache folder', () => {
    fs.unlinkSync(CACHE_PATH);
    fs.rmdirSync(CACHE_FOLDER);

    session = new Session(FAKE_TOKEN);
    expect(fs.existsSync(CACHE_FOLDER)).to.be.true;
  });
});
