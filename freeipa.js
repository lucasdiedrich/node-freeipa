const Config = require('./lib/Config');
const Client = require('./lib/Client');
const Req = require('./lib/RequestBuilder');

/**
 * The caller method which calls the informed METHOD to the final request.
 * @constructor
 * @param {string} method - The method that it should call, for example, user_find.
 * @param {array} args - Freeipa argument to send.
 * @param {array} options - Freeipa options to send.
 */
module.exports.call = function call(method, args, options) {
  return Req.build(method, args || [''], options || {});
};

/**
 * Init config class, rebuild client class with new methods;
 * @constructor
 * @param {json} _options - Custom options that should be filled.
 */
module.exports.configure = function configure(_options) {
  Config.init(_options);

  if (global.Config.configure_client) {
    new Client(this.call).then((client) => {
      module.exports.c = client;
    });
  }
};
