const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

var electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');

if (process.platform === 'win32') {
    electronPath += '.cmd';
}

var appPath = path.join(__dirname, '..');

var app = new Application({
            path: electronPath,
            args: [appPath]
        });

global.before(function () {
    chai.should();
    chai.use(chaiAsPromised);
});


describe('Autographa Test', () => {
  beforeEach(function () {
      return app.start();
  });

  afterEach(()=> {
      return app.stop();
  });

  it('opens a window', () => {
    return app.client.waitUntilWindowLoaded()
      .getWindowCount().should.eventually.equal(1);
  });

  it('tests the title', () => {
    return app.client.waitUntilWindowLoaded()
      .getTitle().should.eventually.equal('Autographa Lite');
  });

});

