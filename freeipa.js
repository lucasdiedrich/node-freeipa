const Config = require('./lib/Config');
const Req = require('./lib/RequestBuilder');

/**
   * Init config class, rebuild client class with new methods;
   * @constructor
   * @param {string} method - The method that should be called, ex: user_mod
   */
class GenericFunction {
  constructor(method) {
    return (args = [''], opts = {}) => Req.build(method, args, opts);
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
          mTarget[property] = new GenericFunction(property);
        }
        return Reflect.get(target, property, receiver);
      },
    });
  }
}

class Main {
  constructor() {
    this.c = () => null;
  }

  /**
   * Init config class, rebuild client class with new methods;
   * @method
   * @param {json} _options - Custom options that should be filled.
   */
  configure(_options) {
    Config.init(_options);

    if (global.Config.configure_client) {
      console.log('!!! NODE-FREEIPA: This method is DEPRECATED, check manual to see new usage... !!!');
      console.log('!!! NODE-FREEIPA: Redirecting... !!!');
      this.c = this;
    }
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
    return this[method](args, opts);
  }
}

module.exports = new ExtendableProxy(new Main());
