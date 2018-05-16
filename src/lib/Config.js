const { _extend } = require('util');

const AUTH_PASS = 'auth';
const AUTH_KRB = 'kerberos';

/**
 * Default options
 */
const options = {
  auth_method: AUTH_PASS,
  server: 'domain-not-changed',
  auth: {
    user: false,
    pass: false,
  },
  ca: false,
  krb: false,
  rejectUnauthorized: true,
  client_version: '2.156',
  expires: 1439,
};

/**
 * This class handle the general config of the app. This are the default configurable options,
 * and should be changed using the freeipa.configure({opts})
 * @constructor
 * @param {json} _options - Custom options that should be filled.
 */
module.exports.init = function init(_options) {
  const myOptions = _extend(options, _options);

  if (!myOptions.ca) {
    myOptions.rejectUnauthorized = false;
  }

  if (myOptions.krb) {
    myOptions.auth_method = AUTH_KRB;
  }

  global.Config = myOptions;

  return myOptions;
};
