const PouchDB = require('pouchdb').default;
const path = require('path');
const app = require('electron').remote.app 
let basepath = app.getAppPath();
let _targetDb, _referenceDb, _lookupsDb;

const lookupsDb = () => {
  console.log('init lookupsDB');
  _lookupsDb = _lookupsDb || new PouchDB(path.join(basepath, "db", "lookupsDB"));
  return _lookupsDb;
};

const targetDb = () => {
  console.log(app.getAppPath())
  _targetDb = _targetDb || new PouchDB(path.join(basepath, "db", "targetDB"));
  return _targetDb;
};

const referenceDb = () => {
  console.log('init referenceDB');
  _referenceDb = _referenceDb || new PouchDB.plugin(require('pouchdb-quick-search'))(path.join(basepath, "db", "referenceDB"));
  return _referenceDb;
};

module.exports = {
  targetDb,
  referenceDb,
  lookupsDb,
}