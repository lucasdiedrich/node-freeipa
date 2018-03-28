// CHAI CONFIGS
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
// const sinonStubPromise = require('sinon-stub-promise');
// sinonStubPromise(sinon);
chai.use(sinonChai);
global.should = chai.should();
global.assert = chai.assert;
global.expect = chai.expect;

// load fixtures
before(() => {
  global.fx = require('node-fixtures');
});

// here you can clear fixtures, etc.
after(() => {
  
});
