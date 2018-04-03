// CHAI CONFIGS
const chai = require('chai');

global.should = chai.should();
global.assert = chai.assert;
global.expect = chai.expect;

global.fx = require('node-fixtures');

// load fixtures
beforeEach(() => {
  global.fx.reset();
});

// here you can clear fixtures, etc.
after(() => { });
