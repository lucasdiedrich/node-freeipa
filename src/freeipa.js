const Config = require('./lib/Config');
const Build = require('./lib/RequestBuilder');

/**
   * Init config class, rebuild client class with new methods;
   * @constructor
   * @param {string} method - The method that should be called, ex: user_mod
   * @param {string} main - An pointer to the current Main to get the config
   */
class GenericFunction {
  constructor(method, main) {
    return (args = [''], opts = {}) => new Build(method, args, opts, main.config);
  }
}

/**
   * Init config class, rebuild client class with new methods;
   * @constructor
   * @param {Object} proxiedObject - The object that will be proxied
   */
class ExtendableProxy {
  constructor(proxiedObject) {
    return new Proxy(proxiedObject, {
      get(target, property, receiver) {
        if (!target[property]) {
          const mTarget = target;
          mTarget[property] = new GenericFunction(property, proxiedObject);
        }
        return Reflect.get(target, property, receiver);
      },
    });
  }
}

class Main {
  /**
   * Init config class, rebuild client class with new methods;
   * @method
   * @param {json} _options - Custom options that should be filled.
   */
  configure(_options) {
    this.config = new Config(_options);
  }

  /**
   * The caller method which calls the informed METHOD to the final request.
   * @method
   * @param {string} method - The method that it should call, for example, user_find.
   * @param {array} args - Freeipa argument to send.
   * @param {json} options - Freeipa options to send.
   */
  call(method, args, opts) {
    console.log('!!! NODE-FREEIPA: This method is DEPRECATED, check manual to see new usage... !!!');
    console.log('!!! NODE-FREEIPA: Redirecting... !!!');
    return this[method](args, opts, this);
  }
}

module.exports = new ExtendableProxy(new Main());
