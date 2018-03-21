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
 	//it("check layout", function() {
 	//        	app.client.elements('.layout2x').then((elements)=> {
 	//        	console.log(elements);
 	//        	return false;
 	//    	});
	// });

	// it('should assess webview', function() {
 	//    	return app.client.waitUntilWindowLoaded()
 	//        .click("") // check whether selector is present in DOM
 	//        .then(console.log.bind(console))
	// });

	// it('should open book popup', ()=> {
	// 	return app.client.click("#bookBtn");
	// });

	// it('should open chapters popup', ()=> {
	// 	return app.client.click("#chapterBtn");
	// });

	// it('should connect to target and ref db', ()=> {
	// 	const refDb = require(`${__dirname}/../app/util/data-provider`).referenceDb();
	// 	const db = require(`${__dirname}/../app/util/data-provider`).targetDb();
	// });
	// it('should target db exists', ()=>{
	// 	const db = require(`${__dirname}/../app/util/data-provider`).targetDb();
	// 	db.get('isDBSetup').then((doc)=> {
	// 	    // console.log(doc);	
	// 	}, (err) => {
	// 		console.log(err)
	// 	})
	// });

	// it('should save the target', ()=> {

	// 	return app.client.click("#btn-save");
	// });

	it('should check reference verse exist', () => {
	 	  const input = 'this is a test';
	 	return app.client.waitUntilWindowLoaded()
	 		.waitForExist("#v1", 20000)
	 		.getText("div[data-verse='r1']>.verse-num").should.eventually.equal("1")
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
  		return app.client.waitUntilWindowLoaded().getText('#book-chapter-btn').should.eventually.equal('Genesis');
  	})
  	// // it('should should change layout to 4x', (done) => {
  	// 	app.client.click("#btn-4x").element(".layout3x");
  	// 	done();
  	// })

  	// it('should should change layout to default', (done) => {
  	// 	app.client.click("#btn-2x");
  	// 	done();
  	// })

});