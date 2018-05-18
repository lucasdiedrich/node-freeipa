
const ipa = require('../../src/freeipa');

describe('Configure Consumer', () => {
  beforeEach(() => {
    ipa.config = null;
  });

  it('should change global.Config', () => {
    ipa.configure(global.fx.config);
    expect(ipa.config).to.exist;
  });

  it('should default options to be', () => {
    ipa.configure(global.fx.config);
    expect(ipa.config.auth_method).to.eql('auth');
    expect(ipa.config.ca).to.be.false;
    expect(ipa.config.krb).to.be.false;
    expect(ipa.config.rejectUnauthorized).to.be.false;
    expect(ipa.config.client_version).to.be.not.null;
  });

  it('should change CA verification', () => {
    global.fx.config.ca = 'path_to_ca_file';
    ipa.configure(global.fx.config);
    expect(ipa.config.rejectUnauthorized).to.be.false;
  });

  it('should change auth method to KERBEROS', () => {
    global.fx.config.krb = 'path_to_keytab_file';
    ipa.configure(global.fx.config);
    expect(ipa.config.auth_method).to.eql('kerberos');
  });
});
