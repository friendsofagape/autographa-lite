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

  	it('should check book button', () => {
  		return app.client.waitUntilWindowLoaded()
  		.getText('#book-chapter-btn').should.eventually.equal('Genesis');
  	});

  	it('should save the target text', () => {
	 	  const input = 'this is a test';
	 	return app.client.waitUntilWindowLoaded()
	 		.waitForVisible("#versediv1", 20000)
      .click("#versediv1")
      .keys(input)
      .click("#versediv2")
      .keys('check    for spaces')
      .click("#versediv3")
      .keys('incompleteVerse')
	 		.waitForExist("#save-btn", 20000)
	 		.click('#save-btn')
	 		.getText("#v1").should.eventually.equal(input);
  	});

    it('should open the settings popup and save setting', () => {
      return app.client.waitUntilWindowLoaded()
      .keys('Escape')
      .waitForEnabled("#btnSettings", 2000)
      .click("#btnSettings")
      .waitForVisible("#lang-code", 2000)
      .setValue("#lang-code", 'eng')
      .keys('Tab')
      .setValue("#lang-version", "NET-S3")
      .setValue("#export-folder-location", path.join("/"))
      .waitForExist("#save-setting", 20000)
      .click("#save-setting")
      .keys("Escape")
    });

    it('close the app', () => {
      return app.stop();
    });

    it('open the app', () => {
      return app.start();
    });

    it('should check the saved target verse', ()=>{
     const input = 'this is a test';
      return app.client.waitUntilWindowLoaded()
      .waitForVisible("#v1", 20000)
      .getText("#v1").should.eventually.equal(input);
    });

    it('should click the diff button and count addition', () => {
      return app.client.waitUntilWindowLoaded()
      .waitForEnabled('#diff', 20000)
      .click('#diff')
      .waitForExist("#tIns", 20000)
      .getText("#tIns").should.eventually.equal('9');
    });

    it('should click off the diff button', () => {
      return app.client.waitUntilWindowLoaded()
      .click('#diff');
    });

    it('should click the diff button and count deletion', () => {
      return app.client.waitUntilWindowLoaded()
      .click('#diff')
      .waitForExist("#tDel", 20000)
      .getText("#tDel").should.eventually.equal('713');
    });

    it('should click off the diff button', () => {
      return app.client.waitUntilWindowLoaded()
      .click('#diff');
    });

    it('should check chapter button', () => {
      return app.client.waitUntilWindowLoaded()
      .getText('#chapterBtn').should.eventually.equal('1');
    });

  	it('should change layout to 3x', () => {
  		return app.client.waitUntilWindowLoaded()
  		.waitForEnabled("#btn-3x", 20000)
  		.click("#btn-3x")
  		.getText('.layout2x').should.eventually.exist;
  	});

    it('should change layout to 4x', () => {
  		return app.client.waitUntilWindowLoaded()
  		.waitForEnabled("#btn-4x", 20000)
  		.click("#btn-4x")
  		.getText('.layout3x').should.eventually.exist;
  	});

  	it('should change layout to 2x', () => {
  		return app.client.waitUntilWindowLoaded()
  		.waitForEnabled("#btn-2x", 20000)
  		.click("#btn-2x")
  		.getText('.layoutx').should.eventually.exist;
  	});

    it('should check empty chapter report', () => {
      return app.client.waitUntilWindowLoaded()
      .click(".translation > a")
      .getText(".empty-chapter-report").should.eventually.equal('2-50')
    });

    it('should check incomplete verse report', () => {
      return app.client.waitUntilWindowLoaded()
      .getText(".incomplete-verse-report").should.eventually.equal('1:3');
    });

    it('should check multiple space in verse report', () => {
      return app.client.waitUntilWindowLoaded()
      .getText(".multiple-space-report").should.eventually.equal('1:2');
    });


    // it('should clear the save  target text', () => {
    //   const input = '';
    // return app.client.waitUntilWindowLoaded()
    //   .click("#v1")
    //   .setValue("#v1", '')
    //   .setValue("#v2", '')
    //   .setValue("#v3", '')
    //   .waitForExist("#save-btn", 20000)
    //   .click('#save-btn')
    //   .getText("#v1").should.eventually.equal(input);
    // });
}); 