const Application = require("spectron").Application;
const path = require("path");
const chai = require("chai");
var assert = require("assert");
const chaiAsPromised = require("chai-as-promised");
const fs = require("fs");

const electron = require("spectron").remote;

const electronPath =
	path.join(__dirname, "..", "node_modules", ".bin", "electron") +
	(process.platform === "win32" ? ".cmd" : "");

const appPath = path.join(__dirname, "..");

const app = new Application({
	path: electronPath,
	args: [appPath]
});

const now = new Date();
const timestampedSampleText = `this is a test ${now.getDate()}/${now.getMonth() +
	1}/${now.getFullYear()} ${now.getTime()}`;
const importfile = `${appPath}/public/gen.usfm`;
const importdir = appPath + "/public";

global.before(function() {
	chai.should();
	chai.use(chaiAsPromised);
});

describe("Autographa Test", () => {
	before(function() {
		return app.start();
	});

	after(() => {
		return app.stop();
	});

	describe("basic app start check", () => {
		it("opens a window", () => {
			return app.client
				.waitUntilWindowLoaded()
				.getWindowCount()
				.should.eventually.equal(1);
		});

		it("tests the title", () => {
			return app.client
				.waitUntilWindowLoaded()
				.getTitle()
				.should.eventually.equal("Autographa Lite");
		});

		it("should check for new imported refernce verse", () => {
			return app.client
				.waitUntilWindowLoaded()
				.waitForExist("#v1", 20000)
				.getText("div[data-verse='r1']>.verse-num")
				.should.eventually.equal("1");
		});
	});

	describe("statistic report with empty data", () => {
		it("should check empty chapter not found", () => {
			return app.client
				.waitUntilWindowLoaded()
				.click(".translation > a")
				.getText(".empty-chapter-report")
				.should.eventually.equal("1-50");
		});

		it("should check incomplete verse not found", () => {
			return app.client
				.waitUntilWindowLoaded()
				.getText(".incomplete-verse-report")
				.should.eventually.equal("Not found.");
		});

		it("should check multiple space of verse not found", () => {
			return app.client
				.waitUntilWindowLoaded()
				.getText(".multiple-space-report")
				.should.eventually.equal("Not found.");
		});
	});

	describe("basic text check on both ref and trans panel", () => {
		it("close the app", () => {
			return app.stop();
		});

		it("open the app", () => {
			return app.start();
		});

		it("should check reference verse exist", () => {
			return app.client
				.waitUntilWindowLoaded()
				.waitForExist("#v1", 20000)
				.getText("div[data-verse='r1']>.verse-num")
				.should.eventually.equal("1");
		});

		it("should check book button", () => {
			return app.client
				.waitUntilWindowLoaded()
				.getText("#book-chapter-btn")
				.should.eventually.equal("Genesis");
		});

		it("should save the target text", () => {
			return app.client
				.waitUntilWindowLoaded()
				.keys("Tab")
				.waitForVisible("#versediv1", 20000)
				.click("#versediv1")
				.keys(timestampedSampleText)
				.click("#versediv2")
				.keys("check    for spaces")
				.click("#versediv3")
				.keys("incompleteVerse")
				.waitForExist("#save-btn", 20000)
				.click("#save-btn")
				.getText("#v1")
				.should.eventually.equal(timestampedSampleText);
		});

		it("Check for cursor position edit", () => {
			const input = "Check for cursor position edit ";
			return app.client
				.waitUntilWindowLoaded()
				.waitForVisible("#versediv4", 20000)
				.click("#versediv4")
				.keys("Check for cursor position")
				.pause(3000)
				.keys(" edit ")
				.pause(3000)
				.getText("#v4")
				.should.eventually.equal(input);
		});

		it("should click the ref drop down", () => {
			return app.client
				.waitUntilWindowLoaded()
				.click(".ref-drop-down")
				.getValue(".ref-drop-down")
				.should.eventually.equal("eng_ult");
		});

		it("should check the verse in translation panel", () => {
			return app.client
				.waitUntilWindowLoaded()
				.waitForVisible("#v1", 20000)
				.getText("#v1")
				.should.eventually.equal(timestampedSampleText);
		});

		it("should change the ref drop down text", () => {
			return app.client
				.waitUntilWindowLoaded()
				.click(".ref-drop-down")
				.selectByIndex(".ref-drop-down", 1)
				.getValue(".ref-drop-down")
				.should.eventually.equal("eng_ust");
		});

		it("After ref change should check the verse again in translation panel", () => {
			return app.client
				.waitUntilWindowLoaded()
				.waitForVisible("#v1", 20000)
				.getText("#v1")
				.should.eventually.equal(timestampedSampleText);
		});

		it("should change the ref drop down text eng_ult", () => {
			return app.client
				.waitUntilWindowLoaded()
				.click(".ref-drop-down")
				.selectByIndex(".ref-drop-down", 0)
				.getValue(".ref-drop-down")
				.should.eventually.equal("eng_ult");
		});

		it("should open the settings popup and save setting", () => {
			return app.client
				.waitUntilWindowLoaded()
				.keys("Escape")
				.waitForEnabled("#btnSettings", 2000)
				.click("#btnSettings")
				.waitForVisible("#lang-code", 2000)
				.setValue("#lang-code", "eng")
				.keys("Tab")
				.setValue("#lang-version", "NET-S3")
				.setValue("#export-folder-location", appPath)
				.waitForExist("#save-setting", 20000)
				.click("#save-setting")
				.keys("Escape");
		});
	});

	describe("save text ", () => {
		it("should check the saved target verse", () => {
			return app.client
				.waitUntilWindowLoaded()
				.waitForVisible("#v1", 20000)
				.getText("#v1")
				.should.eventually.equal(timestampedSampleText);
		});
	});

	describe("check diff", () => {
		it("close the app", () => {
			return app.stop();
		});

		it("open the app", () => {
			return app.start();
		});

		it("should click the diff button and count addition", () => {
			return app.client
				.waitUntilWindowLoaded()
				.waitForEnabled("#diff", 20000)
				.click("#diff")
				.waitForExist("#tIns", 20000)
				.getText("#tIns")
				.should.eventually.equal("18");
		});

		it("should click off the diff button", () => {
			return app.client.waitUntilWindowLoaded().click("#diff");
		});

		it("should click the diff button and count deletion", () => {
			return app.client
				.waitUntilWindowLoaded()
				.click("#diff")
				.waitForExist("#tDel", 20000)
				.getText("#tDel")
				.should.eventually.equal("713");
		});

		it("should click off the diff button", () => {
			return app.client.waitUntilWindowLoaded().click("#diff");
		});
	});

	describe("chapter button", () => {
		it("should check chapter button", () => {
			return app.client
				.waitUntilWindowLoaded()
				.getText("#chapterBtn")
				.should.eventually.equal("1");
		});
	});

	describe("check layout", () => {
		it("should change layout to 3x", () => {
			return app.client
				.waitUntilWindowLoaded()
				.waitForEnabled("#btn-3x", 20000)
				.click("#btn-3x")
				.getText(".layout2x").should.eventually.exist;
		});

		it("Should keep newly saved text viewable when layout changes to 3x", () => {
			return app.client
				.waitUntilWindowLoaded()
				.waitForVisible("#v1", 20000)
				.getText("#v1")
				.should.eventually.equal(timestampedSampleText);
		});

		it("should check highlight verse on 3x", () => {
			let style =
				"background-color: rgba(11, 130, 255, 0.1); padding-left: 10px; padding-right: 10px; border-radius: 10px;";
			let matched = true;
			return app.client
				.waitUntilWindowLoaded()
				.waitForExist("#v1", 20000)
				.click("#versediv1")
				.getAttribute("div[data-verse='r1']", "style")
				.then(res => {
					res.forEach(data => {
						if (style !== data) {
							matched = false;
						}
					});
					assert.strictEqual(true, matched, "style matched");
				});
		});

		it("should change layout to 4x", () => {
			return app.client
				.waitUntilWindowLoaded()
				.waitForEnabled("#btn-4x", 20000)
				.click("#btn-4x")
				.getText(".layout3x").should.eventually.exist;
		});

		it("Should keep newly saved text viewable when layout changes to 4x", () => {
			return app.client
				.waitUntilWindowLoaded()
				.waitForVisible("#v1", 20000)
				.getText("#v1")
				.should.eventually.equal(timestampedSampleText);
		});

		it("should check highlight verse on 4x", () => {
			let style =
				"background-color: rgba(11, 130, 255, 0.1); padding-left: 10px; padding-right: 10px; border-radius: 10px;";
			let matched = true;
			return app.client
				.waitUntilWindowLoaded()
				.waitForExist("#v1", 20000)
				.click("#versediv1")
				.getAttribute("div[data-verse='r1']", "style")
				.then(res => {
					res.forEach(data => {
						if (style !== data) {
							matched = false;
						}
					});
					assert.strictEqual(true, matched, "style matched");
				});
		});

		it("should change layout to 2x", () => {
			return app.client
				.waitUntilWindowLoaded()
				.waitForEnabled("#btn-2x", 20000)
				.click("#btn-2x")
				.getText(".layoutx").should.eventually.exist;
		});

		it("should check highlight verse on 2x", () => {
			return app.client
				.waitUntilWindowLoaded()
				.waitForExist("#v1", 20000)
				.click("#versediv1")
				.getAttribute("div[data-verse='r1']", "style")
				.should.eventually.equal(
					"background-color: rgba(11, 130, 255, 0.1); padding-left: 10px; padding-right: 10px; border-radius: 10px;"
				);
		});

		it("should check verse existance after 3x, 4x click", () => {
			const input = "Check for verse5 after 3x 4x click";
			return app.client
				.waitUntilWindowLoaded()
				.waitForVisible("#versediv5", 20000)
				.click("#versediv5")
				.keys("Check for verse5 after 3x 4x click")
				.click("#btn-3x")
				.click("#btn-4x")
				.click("#btn-2x")
				.getText("#v5")
				.should.eventually.equal(input);
		});
	});

	describe("Export File", () => {
		it("should export the 1 column html file", () => {
			return app.client
				.waitUntilWindowLoaded()
				.click(".dropdown-toggle")
				.click("#export-1-column")
				.waitForVisible(".swal-text", 2000)
				.getText(".swal-text")
				.then(
					res => {
						if (fs.existsSync(res.replace("Exported file at: ", ""))) {
							assert.strictEqual(
								true,
								true,
								"file exported at the saved location"
							);
							fs.unlinkSync(res.replace("Exported file at: ", ""));
						} else {
							assert.strictEqual(
								true,
								false,
								"file doesn't exported at saved location"
							);
						}
					},
					err => {
						assert.strictEqual(
							true,
							false,
							"file doesn't exported at saved location"
						);
					}
				)
				.keys("Escape");
		});

		it("should export the 2 column html file", () => {
			return app.client
				.waitUntilWindowLoaded()
				.click(".dropdown-toggle")
				.click("#export-2-column")
				.waitForVisible(".swal-text", 2000)
				.getText(".swal-text")
				.then(
					res => {
						if (fs.existsSync(res.replace("Exported file at: ", ""))) {
							assert.strictEqual(
								true,
								true,
								"file exported at the saved location"
							);
							fs.unlinkSync(res.replace("Exported file at: ", ""));
						} else {
							assert.strictEqual(
								true,
								false,
								"file doesn't exported at saved location"
							);
						}
					},
					err => {
						assert.strictEqual(
							true,
							false,
							"file doesn't exported at saved location"
						);
					}
				)
				.keys("Escape");
		});

		it("should export the usfm file", () => {
			return app.client
				.waitUntilWindowLoaded()
				.click(".dropdown-toggle")
				.click("#export-usfm-file")
				.waitForVisible("#stageText", 2000)
				.keys("Tab")
				.keys("Tab")
				.keys("Tab")
				.keys("#stageText", "stage1-export-demo")
				.keys("Tab")
				.waitForExist("#btn-export-usfm", 2000)
				.keys("Tab")
				.click("#btn-export-usfm > div > div")
				.waitForVisible(".swal-text", 2000)
				.getText(".swal-text")
				.then(
					res => {
						if (fs.existsSync(res.replace("Exported file at:", ""))) {
							assert.strictEqual(
								true,
								true,
								"file exported at the saved location"
							);
							fs.unlinkSync(res.replace("Exported file at:", ""));
						} else {
							assert.strictEqual(
								true,
								false,
								"file doesn't exported at saved location"
							);
						}
					},
					err => {
						console.log(err);
						assert.strictEqual(
							true,
							false,
							"file doesn't exported at saved location"
						);
					}
				)
				.keys("Escape")
				.waitForVisible("#tab-search", 2000, true);
		});
	});

	describe("Statistic Report", () => {
		it("should check empty chapter report", () => {
			return app.client
				.waitUntilWindowLoaded()
				.waitForVisible(".translation > a")
				.click(".translation > a")
				.getText(".empty-chapter-report")
				.should.eventually.equal("2-50");
		});

		it("should check incomplete verse report", () => {
			return app.client
				.waitUntilWindowLoaded()
				.getText(".incomplete-verse-report")
				.should.eventually.equal("1:3");
		});

		it("should check multiple space in verse report", () => {
			return app.client
				.waitUntilWindowLoaded()
				.getText(".multiple-space-report")
				.should.eventually.equal("1:2");
		});
	});

	describe.only("USFM file import", () => {
		it("close the app", () => {
			return app.stop();
		});

		it("open the app", () => {
			return app.start();
		});

		it("should import the translation file", () => {
			const input = "this is a test";
			return app.client
				.waitUntilWindowLoaded()
				.waitForEnabled("#btnSettings", 2000)
				.click("#btnSettings")
				.click("#left-tabs-example-tab-second")
				.waitForVisible("#import-file-trans", 2000)
				.keys("Tab")
				.setValue("#import-file-trans", importfile)
				.waitForExist("#btn-import-trans")
				.click("#btn-import-trans")
				.waitForVisible("#v1", 60000)
				.getText("#v1")
				.should.eventually.equal(input);
		});

		it("should import the reference version", () => {
			return app.client
				.waitUntilWindowLoaded()
				.waitForVisible("#btnSettings", 2000)
				.click("#btnSettings")
				.click("#left-tabs-example-tab-third")
				.waitForVisible("#import-ref-name")
				.setValue("#import-ref-name", "test")
				.keys("Tab")
				.setValue("#import-ref-lang", "eng")
				.keys("Tab")
				.setValue("#import-ref-version", "net")
				.keys("Tab")
				.keys("Tab")
				.setValue("#import-ref-path", importdir)
				.waitForExist("#btn-import-ref")
				.click("#btn-import-ref");
		});

		it("should check for new reference version", () => {
			return app.client
				.waitUntilWindowLoaded()
				.waitForVisible(".ref-drop-down", 30000)
				.click(".ref-drop-down")
				.selectByIndex(".ref-drop-down", 0)
				.getValue(".ref-drop-down")
				.should.eventually.equal("test_eng_net");
		});
	});
});
