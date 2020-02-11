
const { configure } = require('../../src/freeipa');
const Config = require('../../src/lib/Config');
const RequestBuilder = require('../../src/lib/RequestBuilder');
const Request = require('../../src/lib/Request');
const Session = require('../../src/lib/Session');

describe('Smoke tests', () => {
  it('configure method - freeipa.js', () => {
    expect(configure).to.exist;
  });
  it('Main method - lib/Config.js', () => {
    expect(Config).to.exist;
  });
  it('Main method - lib/RequestBuilder.js', () => {
    expect(RequestBuilder).to.exist;
  });
  it('Main method - lib/Session.js', () => {
    expect(Session).to.exist;
  });
  it('Main method - lib/Request.js', () => {
    expect(Request).to.exist;
  });
});
