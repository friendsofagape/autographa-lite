var targetDb,
    referenceDb,
    referenceDbSearch,
    lookupsDb;

module.exports = {
    targetDb: function() {
	if(typeof targetDb === 'undefined') {
	    var PouchDB = require('pouchdb-core')
	      	.plugin(require('pouchdb-adapter-leveldb'));
	    targetDb = new PouchDB("db/targetDB");
	}
	return targetDb;
    },
    referenceDb: function() {
	if(typeof referenceDb === 'undefined') {
	    var PouchDB = require('pouchdb-core')
	      	.plugin(require('pouchdb-adapter-leveldb'))
		.plugin(require('pouchdb-quick-search'));
	    referenceDb = new PouchDB("db/referenceDB");
	}
	return referenceDb;
    },
    lookupsDb: function() {
	if(typeof lookupsDb === 'undefined') {
	    var PouchDB = require('pouchdb-core')
	      	.plugin(require('pouchdb-adapter-leveldb'));
	    lookupsDb = new PouchDB("db/lookupsDB");
	}
	return lookupsDb;
	}

}
