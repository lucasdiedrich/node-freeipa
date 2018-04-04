const ipa = require('../../src/freeipa');
const sinon = require('sinon');

const userFind = sinon.spy(ipa, 'user_find');

describe('Client tests', () => {
  // const timeout = 5000;

  it('should the new client be defined', () => {
    expect(ipa.user_find).to.exist;
  });

  it('should call exists and be an function', () => {
    expect(ipa.call).to.be.an.instanceof(Function);
  });

  it('should call user_find redirect to new client', () => {
    ipa.configure(global.fx.config);

    ipa.call('user_find');
    expect(userFind.called).to.be.true;
  });

  it('should the client ipa.c be null', () => {
    expect(ipa.c()).to.be.null;
  });

  it('should the client ipa.c to exist', () => {
    global.fx.config.configure_client = true;
    ipa.configure(global.fx.config);
    expect(ipa.c).to.not.be.null;
  });

  it('should the client ipa.c redirect to new client2', () => {
    global.fx.config.configure_client = true;
    ipa.configure(global.fx.config);

    ipa.c.user_find();
    expect(userFind.callCount).to.be.at.least(2);
  });

  it('should the client ipa.c redirect to new client', () => {
    global.fx.config.configure_client = true;
    ipa.configure(global.fx.config);
    expect(ipa.c.user_find).to.eql(ipa.user_find);
  });
});
