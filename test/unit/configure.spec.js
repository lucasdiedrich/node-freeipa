
const { configure } = require('../../src/freeipa');

describe('Configure Consumer', () => {
  beforeEach(() => {
    global.Config = undefined;
  });

  it('should be undefined', () => {
    expect(global.Config).to.be.undefined;
  });

  it('should change global.Config', () => {
    configure(global.fx.config);
    expect(global.Config).to.exist;
  });

  it('should default options to be', () => {
    configure(global.fx.config);
    expect(global.Config.auth_method).to.eql('auth');
    expect(global.Config.ca).to.be.false;
    expect(global.Config.krb).to.be.false;
    expect(global.Config.rejectUnauthorized).to.be.false;
    expect(global.Config.client_version).to.be.not.null;
  });

  it('should change CA verification', () => {
    global.fx.config.ca = 'path_to_ca_file';
    configure(global.fx.config);
    expect(global.Config.rejectUnauthorized).to.be.false;
  });

  it('should change auth method to KERBEROS', () => {
    global.fx.config.krb = 'path_to_keytab_file';
    configure(global.fx.config);
    expect(global.Config.auth_method).to.eql('kerberos');
  });
});
