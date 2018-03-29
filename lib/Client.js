const METADATA = 'json_metadata';

/**
 * This class handles the dynamic creation of methods based on freeipa server version.
 * All methods are returned using a json_medata request.
 * @constructor
 * @param {function} callback - Callback function to be called after finish the attribute reading.
 */
module.exports = function Main(callback) {
  const self = this;

  return new Promise((resolve, reject) => {
    callback(METADATA).then((result) => {
      try {
        // eslint-disable-next-line no-restricted-syntax
        for (const attributename in result.methods) {
          if (Object.prototype.hasOwnProperty.call(result.methods, attributename)) {
            self[attributename] = (args, options) => callback(attributename, args, options);
          }
        }
        resolve(self);
      } catch (error) {
        reject(new Error(error));
      }
    });
  });
};
