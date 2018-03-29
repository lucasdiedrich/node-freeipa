const ipa = require('../../freeipa');

describe('Dynamic client Consumer', () => {
  const timeout = 25000;

  it('should the client be undefined', () => {
    ipa.configure(global.fx.config);
    expect(ipa.c).to.be.undefined;
  });

  it('should call user_find manually', (done) => {
    global.fx.config.configure_client = true;
    ipa.configure(global.fx.config);

    ipa.call('user_find').then((result) => {
      expect(result).to.exist;
      done();
    });
  }).timeout(timeout + 1000);

  it('should the client be defined', (done) => {
    setTimeout(() => {
      expect(ipa.c).to.exist;
      done();
    }, timeout);
  }).timeout(timeout + 1000);
});
