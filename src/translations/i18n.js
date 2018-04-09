const path = require("path")
const electron = require('electron');
const electronRemote = require('electron').remote;
const fs = require('fs');
let loadedLanguage;
let app = electron.app ? electron.app : electron.remote.app;
const rtlDetect = require('rtl-detect');
const refDb = require(`${__dirname}/../util/data-provider`).referenceDb();
// const refDb = electronRemote.getCurrentWindow().refDb

module.exports = i18n;



function i18n() {
	loadedLanguage = refDb.get('app_locale').then(function(doc) {
		if(fs.existsSync(path.join(__dirname, doc.appLang + '.js'))) {
			return JSON.parse(fs.readFileSync(path.join(__dirname, doc.appLang + '.js'), 'utf8'))
		}
		else {
			return JSON.parse(fs.readFileSync(path.join(__dirname, 'en.js'), 'utf8'))
		}
	}).catch(function(error){
		return JSON.parse(fs.readFileSync(path.join(__dirname, 'en.js'), 'utf8'))
	})
}

i18n.prototype.getLocale = function() {
	return refDb.get('app_locale').then(function(doc) {
		return doc.appLang;
	}).catch(function(error){
		return 'en';
	});
}

i18n.prototype.isRtl = function(){
	return this.getLocale().then((res) => rtlDetect.isRtlLang(res));
}

i18n.prototype.currentLocale = function() {
	return loadedLanguage.then(function(res){
		return res['0']
	})
}

i18n.prototype.__ = function(phrase) {
	return loadedLanguage.then(function(res){
		let translation = res[phrase]
		if(translation === undefined) {
	    	translation = phrase
	  	}
	  	return translation;
	})
}
