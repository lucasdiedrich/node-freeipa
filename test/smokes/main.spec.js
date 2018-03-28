
const { configure, call } = require('../../freeipa');
const Client = require('../../lib/Client');
const Config = require('../../lib/Config');
const RequestBuilder = require('../../lib/RequestBuilder');
const Session = require('../../lib/Session');

describe('Smoke tests', () => {
  it('configure method - freeipa.js', () => {
    expect(configure).to.exist;
  });
  it('call method - freeipa.js', () => {
    expect(call).to.exist;
  });
  it('Main method - lib/Client.js', () => {
    expect(Client).to.exist;
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
});
