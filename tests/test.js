const Application = require('spectron').Application;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

var electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
const electron = require('spectron').remote;



if (process.platform === 'win32') {
    electronPath += '.cmd';
}

var appPath = path.join(__dirname, '..');

var app = new Application({
    path: electronPath,
    args: [appPath]
});

global.before(function() {
    chai.should();
    chai.use(chaiAsPromised);
});


describe('Autographa Test', () => {

    before(function() {
        return app.start();
    });

    after(() => {
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
 	
	it('should check reference verse exist', () => {
	 	  const input = 'this is a test';
	 	return app.client.waitUntilWindowLoaded()
	 		.waitForExist("#v1", 20000)
	 		.getText("div[data-verse='r1']>.verse-num").should.eventually.equal('1')
  	});

  	it('should save the target text', () => {
	 	  const input = 'this is a test';
	 	return app.client.waitUntilWindowLoaded()
	 		.waitForExist("#v1", 20000)
	 		.setValue("#v1", input)
	 		.waitForExist("#save-btn", 20000)
	 		.click('#save-btn')
	 		.getText("#v1").should.eventually.equal(input);
  	});

  	it('should check book button', () => {
  		return app.client.waitUntilWindowLoaded()
  		.getText('#book-chapter-btn').should.eventually.equal('Genesis');
  	});

  	it('should check chapter button', () => {
  		return app.client.waitUntilWindowLoaded()
  		.getText('#chapterBtn').should.eventually.equal('1');
  	});

  	it('should change layout to 3x', () => {
  		return app.client.waitUntilWindowLoaded()
  		.waitForExist("#btn-3x", 20000)
  		.click("#btn-3x")
  		.getText('.layout2x').should.eventually.exist;
  	});

  	it('should change layout to 4x', () => {
  		return app.client.waitUntilWindowLoaded()
  		.waitForExist("#btn-4x", 20000)
  		.click("#btn-4x")
  		.getText('.layout3x').should.eventually.exist;
  	});

  	it('should change layout to 2x', () => {
  		return app.client.waitUntilWindowLoaded()
  		.waitForExist("#btn-2x", 20000)
  		.click("#btn-2x")
  		.getText('.layoutx').should.eventually.exist;
  	});

});