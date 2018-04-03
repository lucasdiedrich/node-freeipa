const ipa = require('../../freeipa');
const sinon = require('sinon');
const RequestBuilder = require('../../lib/RequestBuilder');

const build = sinon.spy(RequestBuilder, 'build');

describe('Request Builder Tests', () => {
  before(() => {
    ipa.configure(global.fx.config);
  });

  it('should call user_find and resolv', (done) => {
    ipa.user_find().then((result, reject) => {
      done(reject);
    });
  }).timeout(10000);

  it('should call build method', () => {
    ipa.json_metadata();
    expect(build.called).to.be.true;
  });
  it('should throw an error - invalid config', () => {
    global.Config = null;
    expect(ipa.json_metadata).to.throw(Error);
  });
});
