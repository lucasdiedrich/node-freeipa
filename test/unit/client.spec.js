const ipa = require('../../freeipa');

describe('consumer', () => {
  // const timeout = 5000;

  it('should the new client be defined', () => {
    expect(ipa.user_find).to.exist;
  });

  it('should call user_find redirect to new client', () => {
    expect(ipa.call).to.be.an.instanceof(Function);
  });

  it('should the client ipa.c be null', () => {
    expect(ipa.c()).to.be.null;
  });

  it('should the client ipa.c to exist', () => {
    global.fx.config.configure_client = true;
    ipa.configure(global.fx.config);
    expect(ipa.c).to.not.be.null;
  });

  it('should the client ipa.c redirect to new client', () => {
    global.fx.config.configure_client = true;
    ipa.configure(global.fx.config);
    expect(ipa.c.user_find).to.eql(ipa.user_find);
  });
});
