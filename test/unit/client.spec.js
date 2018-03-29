const ipa = require('../../freeipa');
// const Client = require('../../lib/Client');

describe('Dynamic client Consumer', () => {
  const timeout = 30000;

  it('should the client be undefined', () => {
    ipa.configure(global.fx.config);
    expect(ipa.c).to.be.undefined;
  });

  // it('should call user_find manually', (done) => {
  //   ipa.configure(global.fx.config);
  //   ipa.call('json_metadata').then(function(result) {
  //     done();
  //   });

  // }).timeout(timeout + 1000);

  it('should the client not be undefined', (done) => {
    global.fx.config.configure_client = true;
    ipa.configure(global.fx.config);

    setTimeout(() => {
      expect(ipa.c).to.not.be.undefined;
      done()
    }, timeout);
  }).timeout(timeout + 1000);

  // Not working
  // it('should user_find exist', (done) => {
  //   setTimeout(() => {
  //     ipa.c.user_find([""],{"uid":'someuser'}).then(function(result){
  //       done();
  //     });
  //   }, timeout);
  // }).timeout(timeout + 1000);

});
