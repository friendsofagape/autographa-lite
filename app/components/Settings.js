import React from 'react';
import ReactDOM from 'react-dom';
import { remote } from 'electron';
import { TextField, RaisedButton } from 'material-ui';
import swal from 'sweetalert';
import { observer } from "mobx-react"
import TodoStore from "./TodoStore";
import ReferencePanel from './ReferencePanel';
const { dialog } = require('electron').remote;
const { Tabs, Tab, Modal, Button, Col, Row, Grid, Nav, NavItem } = require('react-bootstrap/lib');
const refDb = require(`${__dirname}/../util/data-provider`).referenceDb();
const lookupsDb = require(`${__dirname}/../util/data-provider`).lookupsDb();
const db = require(`${__dirname}/../util/data-provider`).targetDb();
const Constant = require("../util/constants")
const bibUtil_to_json = require(`${__dirname}/../util/usfm_to_json`);
const session = require('electron').remote.session;
const path = require("path");
const Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs'));

@observer
class SettingsModal extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      settingData: {langCodeValue: "", langCode: "", langVersion: "", folderPath: ""},
      refSetting: {bibleName: "", refLangCodeValue: "", refLangCode: "", refVersion: "", refFolderPath: ""},
      folderPathImport: "",
      refList: [],
      refListEdit: [],
      bibleReference: true,
      visibleList: true,
      myBible: '',
      Details: ''
    };

    this.loadSetting();
    this.loadReference();
  }

  loadSetting = () => {
    const settingData = this.state.settingData;
    db.get('targetBible').then((doc) =>{
      settingData.langCode = doc.targetLang;
      settingData.langVersion = doc.targetVersion;
      settingData.folderPath = doc.targetPath;
    }, (err) => {
      console.log(err);
    });
  }

  loadReference = () => {
     refDb.get('refs').then((doc) => {
      doc.ref_ids.forEach((ref_doc) => {
        let ref_id = ref_doc.ref_id;
        if(Constant.defaultReferences.indexOf(ref_doc.ref_id) >= 0) {
          this.state.refList.push(ref_doc); 
        } else {
          this.state.refListEdit.push(ref_doc);
        }
      });
    })
  }

  onChange = (event) => {
    let settingData = Object.assign({}, this.state.settingData);
        settingData[event.target.name] = event.target.value;
        this.setState({settingData});
  }

  onChangeList = (event) => {
    let settingData = Object.assign({}, this.state.settingData);
        settingData.langCode = event.target.value;
        this.setState({ settingData, visibleList: true });
        this.listLanguage(event.target.value);
        this.setState({});
  }

  matchCode = (input) => {
    var filteredResults = {};
    return lookupsDb.allDocs({
        startkey: input.toLowerCase(),
        endkey: input.toLowerCase() + '\uffff',
        include_docs: true
    }).then(function(response) {
        var data = ""
        if (response != undefined && response.rows.length > 0) {
          Object.keys(response.rows).map((index, value) => {
            if (response.rows) {
              if (!filteredResults.hasOwnProperty(response.rows[index].doc['lang_code'])) {
                filteredResults[response.rows[index].doc['lang_code']] = response.rows[index].doc['name'];
              } else {
                existingValue = filteredResults[response.rows[index].doc['lang_code']]
                filteredResults[response.rows[index].doc['lang_code']] = (existingValue + " , " + response.rows[index].doc['name']);
              }
            }
            return null;
          })
          return filteredResults
        } else {
            return [];
        }
    }).catch(function(err) {
        console.log(err);
    })
  }

  listLanguage = (val) => {
    if (val.length >= 2) {
     var autoCompleteResult = this.matchCode(val)
      autoCompleteResult.then((res)  => {
        if (res != null) {
          this.setState({_listArray: res})
        }
      });  
    }
  }

  onReferenceChange = (event) => {
    let refSetting = Object.assign({}, this.state.refSetting);
        refSetting[event.target.name] = event.target.value;
        this.setState({refSetting});
  }

  onReferenceChangeList = (event) => {
    let refSetting = Object.assign({}, this.state.refSetting);
        refSetting.refLangCode = event.target.value;
        this.setState({ refSetting, visibleList: true });
        this.listLanguage(event.target.value);
        this.setState({});
  }

  target_setting = () => {
    const {langCodeValue, langVersion, folderPath} = this.state.settingData;
    var langCode = langCodeValue,
        version = langVersion,
        path = folderPath,
        isValid = true;
    if (langCode === null || langCode === "") {
        this.setState({message: 'The Bible language code is required.', Details: 'failure' });
        setTimeout(() => {
          this.setState({Details: 'hidemessage'})
        }, 2000);
        isValid = false;
    }else if(langCode.match(/^\d/)) {
        this.setState({message: 'The Bible language code length should be between 3 and 8 characters and can’t start with a number.', Details: 'failure'});
        setTimeout(() => {
          this.setState({Details: 'hidemessage'})
        }, 2000);        
        isValid = false;
    }
    else if((/^([a-zA-Z0-9_-]){3,8}$/).test(langCode) === false){
        this.setState({message: 'The Bible language code length should be between 3 and 8 characters and can’t start with a number.', Details: 'failure'});
        setTimeout(() => {
          this.setState({Details: 'hidemessage'})
        }, 2000);        
        isValid = false;
    }
    else if (version === null || version === "") {
        this.setState({ message:'The Bible version is required.', Details: 'failure' });
        setTimeout(() => {
          this.setState({Details: 'hidemessage'})
        }, 2000);      
        isValid = false;
    } else if (path === null || path === "") {
        this.setState({message: 'The Bible path is required.', Details: 'failure'});
        setTimeout(() => {
          this.setState({Details: 'hidemessage'})
        }, 2000);
        isValid = false;
    } else {
        isValid = true;
    }
    return isValid;
  }

  saveSetting = () => {
    if (this.target_setting() == false) return;
    const {langCodeValue, langVersion, folderPath} = this.state.settingData;
    db.get('targetBible').then((doc) => {
        db.put({
            _id: 'targetBible',
            _rev: doc._rev,
            targetLang: langCodeValue,
            targetVersion: langVersion,
            targetPath: folderPath
        }).then(function(e) {
          swal("Translation Data", "Successfully saved data in database", "success");
        });
    }, (err) =>  {
        db.put({
            _id: 'targetBible',
            targetLang: langCodeValue,
            targetVersion: langVersion,
            targetPath: folderPath
        }).then((res) => {
          swal("Translation Data", "Successfully saved data in database", "success");
        }, (err) => {
          swal("Translation Data", "Oops....", "error");
        })
    });
  }

  openFileDialogSettingData = (event) => {
    dialog.showOpenDialog({
        properties: ['openDirectory'],
        filters: [{ name: 'All Files', extensions: ['*'] }],
        title: "Select reference version folder"
    }, (selectedDir) => {
        if (selectedDir != null) {
          this.state.settingData["folderPath"] = selectedDir;
          this.setState({});
        }
    });
  }

  openFileDialogImportTrans = (event) => {
    dialog.showOpenDialog({
        properties: ['openDirectory'],
        filters: [{ name: 'All Files', extensions: ['*'] }],
        title: "Select reference version folder"
    }, (selectedDir) => {
        if (selectedDir != null) {
          this.setState({folderPathImport: selectedDir});
        }
    });
  }

  openFileDialogRefSetting = (event) => {
    dialog.showOpenDialog({
        properties: ['openDirectory'],
        filters: [{ name: 'All Files', extensions: ['*'] }],
        title: "Select reference version folder"
    }, (selectedDir) => {
        if (selectedDir != null) {
          this.state.refSetting["refFolderPath"] = selectedDir;
          this.setState({});
        }
    });
  }

  import_sync_setting = () => {
    let targetImportPath = this.state.folderPathImport;
    let isValid = true;
    if (targetImportPath === undefined ||targetImportPath === null || targetImportPath === "") {
      this.setState({message: 'The Bible path is required.', Details: 'failure' });
      setTimeout(() => {
        this.setState({Details: 'hidemessage'})
      }, 2000);
      isValid = false;
    }
    return isValid;
  }

  importTranslation = () => {
    if (this.import_sync_setting() == false) return;
    const {langCode, langVersion} = this.state.settingData;
    let inputPath = this.state.folderPathImport;
    var files = fs.readdirSync(inputPath[0]);
    Promise.map(files, function(file){
      var filePath = path.join(inputPath[0], file);
      if (fs.statSync(filePath).isFile() && !file.startsWith('.')) {
        var options = {
          lang: langCode.toLowerCase(),
          version: langVersion.toLowerCase(),
          usfmFile: filePath,
          targetDb: 'target'
        }
        bibUtil_to_json.toJson(options);
      }
    }).then(function(res){
      swal("Translation Data", "Successfully imported text", "success");
    }).catch(function(err){
      swal("Translation Data", "Oops...", "error");
    })
  }

  reference_setting() {
    const {bibleName, refVersion, refLangCodeValue, refLangCode, refFolderPath} = this.state.refSetting;
    var name = bibleName,
        langCode = refLangCode,
        version = refVersion,
        path = refFolderPath,
        isValid = true;
    if (name == "") {
        swal("Error", "The Bible name is required.", "error");
        isValid = false;
    } else if (langCode === null || langCode === "") {
        swal("Error", "The Bible language code is required.", "error");
        isValid = false;
    }else if (version === null || version === "") {
      swal("Error", "The Bible version is required.", "error")
        isValid = false;
    } else if (path === null || path === "") {
        swal("Error", "The Bible path is required.", "error")
        isValid = false;
    } else {
        isValid = true;

    }
    return isValid;
  }

  importReference = () => {
    if (this.reference_setting() == false)
    return;
    const {bibleName, refVersion, refLangCodeValue, refLangCode, refFolderPath} = this.state.refSetting;
    var ref_id_value = refLangCodeValue.toLowerCase() + '_' + refVersion.toLowerCase(),
        ref_entry = {},
        ref_arr = [],
        files = fs.readdirSync(refFolderPath[0]);
        ref_entry.ref_id = ref_id_value;
        ref_entry.ref_name = bibleName;
        ref_entry.isDefault = false;
        ref_arr.push(ref_entry);
        refDb.get('refs').then((doc) => {
          ref_entry = {}
          var refExistsFlag = false;
          var updatedDoc = doc.ref_ids.forEach((ref_doc) => {
            if (ref_doc.ref_id === ref_id_value) {
              refExistsFlag = true;
            }
            ref_entry.ref_id = ref_doc.ref_id;
            ref_entry.ref_name = ref_doc.ref_name;
            ref_entry.isDefault = ref_doc.isDefault;
            ref_arr.push(ref_entry)
            ref_entry= {};
          });
          if (!refExistsFlag) {
              doc.ref_ids = ref_arr;
              refDb.put(doc).then((res)=> {
                  this.saveJsonToDB(files);
              });
          } else {
              this.saveJsonToDB(files);
          }
        },(err) => {
          if (err.message === 'missing') {
              var refs = {
                _id: 'refs',
                ref_ids: []
              };
              ref_entry.isDefault = true;
              refs.ref_ids.push(ref_entry);
              refDb.put(refs).then((res) => {
                  this.saveJsonToDB(files);
              }).catch(function(internalErr) {
              });
          } else if (err.message === 'usfm parser error') {
          } else {
          }
        });
  }

  saveJsonToDB = (files) => {
    const {bibleName, refVersion, refLangCodeValue, refFolderPath} = this.state.refSetting;
    Promise.map(files, function(file) {
      var filePath = path.join(refFolderPath[0], file);
      if (fs.statSync(filePath).isFile() && !file.startsWith('.')) {
        var options = {
          lang: refLangCodeValue.toLowerCase(),
          version: refVersion.toLowerCase(),
          usfmFile: filePath,
          targetDb: 'refs'
        }
        bibUtil_to_json.toJson(options);
      }
    }).then(function(res){
      swal("Import Reference Text", "Successfully loaded new refs", "success");
    }).catch(function(err){
      swal("Import Reference Text", "Error: While loading new refs.", "error");
    })
  }

  clickListSettingData = (evt, obj) => {
    let settingData = Object.assign({}, this.state.settingData);
        settingData.langCode = evt + " " + obj;
        settingData.langCodeValue = obj.slice(1,-1);
    this.setState({ 
      settingData,
      visibleList: false
    });
  }

  clickListrefSetting = (evt, obj) => {
    let refSetting = Object.assign({}, this.state.refSetting);
        refSetting.refLangCode = evt + " " + obj;
        refSetting.refLangCodeValue = obj.slice(1,-1);
    this.setState({ 
      refSetting,
      visibleList: false
    });
  }

  //Rename
  onReferenceRename = (e) => {
    this.setState({bibleReference: !this.state.bibleReference})
  }

  //Remove
  onReferenceRemove = (element) => {
    var ref_ids = [];
    refDb.get('refs').then(function(doc) {
        doc.ref_ids.forEach(function(ref_doc) {
            if (ref_doc.ref_id != element) {
                ref_ids.push({ ref_id: ref_doc.ref_id, ref_name: ref_doc.ref_name, isDefault: ref_doc.isDefault });
            }
        })
        doc.ref_ids = ref_ids;
        return refDb.put(doc);
    }).then(function(res) {
      swal({
        title: "Confirmation",
        text: "Are you sure you want to delete this reference text?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          swal("Proof! Your reference text has been deleted!", {
            icon: "success",
          });
        } else {
          swal("Your reference text is safe!");
        }
      });    
    }).catch(function(err) {
      swal("Error", "Unable to delete please try again.", "error")
    })
  }

  //Save
  onReferenceSave = (e) => {
    this.setState({bibleReference: !this.state.bibleReference});
  }

  //Cancel
  onReferenceCancel = (e) => {
    this.setState({bibleReference: !this.state.bibleReference});
  }

  //onChange Bible
  onChangeBible = (e) => {
    this.state.refListEdit.forEach((ref, index) => {
      this.setState({biblename: e.target.value});
   });
  }


  render(){
    var errorStyle = {
      margin: 'auto',
      textAlign: 'center',
    }

    let closeSetting = () => TodoStore.showModalSettings = false
    const { show } = this.props;
    const { langCodeValue, langCode, langVersion, folderPath } = this.state.settingData;
    const { bibleName, refVersion, refLangCodeValue, refLangCode, refFolderPath } = this.state.refSetting;
    const refList = this.state.refList;
    const refListEdit = this.state.refListEdit;
    const listCode = this.state._listArray;
    let displayCSS = 'none';
    if(listCode != null && Object.keys(listCode).length > 0 && this.state.visibleList) {
      displayCSS = "inline-block";
    } else {
      displayCSS = 'none';
    }

    return (  
      <Modal show={show} onHide={closeSetting} id="tab-settings">
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
          <div className={"alert " + (this.state.Details === 'success' ? 'alert-success msg' : 'invisible')}>
            <span>{this.state.message}</span>
          </div>
          <div className={"alert " + (this.state.Details === 'failure' ? 'alert-danger msg': 'invisible')}>
            <span>{this.state.message}</span>
          </div>
        </Modal.Header>
          <Modal.Body>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Row className="clearfix">
                <Col sm={4}>
                  <Nav bsStyle="pills" stacked>
                    <NavItem eventKey="first">
                      Translation Details
                    </NavItem>
                    <NavItem eventKey="second">
                      Import Translation
                    </NavItem>
                    <NavItem eventKey="third">
                      Import Reference Text
                    </NavItem>
                    <NavItem eventKey="fourth">
                      Manage Reference Texts
                    </NavItem>
                  </Nav>
                </Col>
                <Col sm={8}>
                  <Tab.Content animation>
                      <Tab.Pane eventKey="first" >
                        <div className="form-group" data-tip="Length should be between 3 and 8 characters and can’t start with a number.">
                          <label>Language Code</label>
                          <br />
                          <TextField 
                            hintText="eng"
                            onChange={this.onChangeList.bind(this)}
                            value={langCode || ""}
                            name="langCode"
                          />
                        </div>
                        <div id="target-lang-result" className="lang-code" style={{display: displayCSS}}>
                          <ul>
                            {
                              (listCode != null) ? (
                                Object.keys(listCode).map((key, index) => {
                                 return <li key={index} onClick={this.clickListSettingData.bind(this, listCode[key],`(${key})`)} >
                                          <span className='code-name'>{listCode[key]} {`(${key})`}</span>
                                        </li>})
                                ) : (<li></li>)
                            }
                          </ul>
                        </div>
                        <div className="form-group">
                          <label>Version</label>
                          <br />
                          <TextField
                            hintText="NET-S3"
                            onChange={this.onChange.bind(this)}
                            value={langVersion || ""}
                            name="langVersion"
                          />
                        </div>
                        <div className="form-group">
                          <label>Path to Folder Location</label>
                          <br />
                          <TextField
                            hintText="Path of folder containing USFM files"
                            onChange={this.onChange.bind(this)}
                            value={folderPath || ""}
                            name="folderPath"
                            onClick={this.openFileDialogSettingData}
                          />
                        </div>
                        <RaisedButton label="Save" primary={true} onClick={this.saveSetting}/>  
                      </Tab.Pane>
                      <Tab.Pane eventKey="second">
                        <div className="form-group">
                          <label>Folder Location</label>
                          <br />
                          <TextField
                            hintText="Path of folder containing USFM files" 
                            onChange={this.onChange.bind(this)}
                            value={this.state.folderPathImport}
                            name="folderPathImport"
                            onClick={this.openFileDialogImportTrans}
                          />
                        <RaisedButton style={{float: "right", marginRight: "33px", marginTop: "257px"}} label="Import" primary={true} onClick={this.importTranslation}/>
                        </div>
                      </Tab.Pane>

                      <Tab.Pane eventKey="third">
                          <div>
                            <label>Bible name</label>
                            <br />
                            <TextField 
                              hintText="New English Translation"
                              onChange={this.onReferenceChange.bind(this)}
                              value={bibleName || ""}
                              name="bibleName"
                            />
                          </div>
                          <div data-tip="Length should be between 3 and 8 characters and can’t start with a number.">
                            <label>Language Code</label>
                            <br />
                            <TextField
                              hintText="eng"
                              onChange={this.onReferenceChangeList.bind(this)}
                              value={refLangCode || ""}
                              name="refLangCode"
                            />
                          </div>
                          <div id="reference-lang-result" className="lang-code" style={{display: displayCSS}}>
                          <ul>
                            {
                              (listCode != null) ? (
                                Object.keys(listCode).map((key, index) => {
                                 return <li key={index} onClick={this.clickListrefSetting.bind(this, listCode[key],`(${key})`)} >
                                          <span className='code-name'>{listCode[key]} {`(${key})`}</span>
                                        </li>})
                                ) : (<li></li>)
                            }
                          </ul>
                          </div>
                          <div>
                            <label>Version</label>
                            <br />
                            <TextField
                              hintText="NET-S3"
                              onChange={this.onReferenceChange.bind(this)}
                              value={refVersion || ""}
                              name="refVersion"
                            />
                          </div>
                          <div>
                            <label>Folder Location</label>
                            <br />
                            <TextField
                              hintText="Path of folder containing USFM files"
                              onChange={this.onReferenceChange.bind(this)}
                              value={refFolderPath || ""}
                              ref="refFolderPath"
                              onClick={this.openFileDialogRefSetting}
                            />
                          </div>
                       	<RaisedButton style={{float: "right", marginRight: "33px"}} label="Import" primary={true} onClick={this.importReference}/>
                      </Tab.Pane>

                      <Tab.Pane eventKey="fourth">
                        <div style={{overflowY: "scroll", maxHeight: "343px"}}>
                          <table className="table table-bordered table-hover table-striped">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Language Code</th>
                                <th>Version</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody id="reference-list">
                              { 
                                refListEdit.map((ref, index) => {
                                  let ref_first = ref.ref_id.substr(0, ref.ref_id.indexOf('_'));
                                  let ref_except_first =  ref.ref_id.substr(ref.ref_id.indexOf('_')+1);
                                  return(
                                    <tr key={index}>
                                      <td>
                                        {
                                         (this.state.bibleReference) ? (
                                            <div>{this.state.biblename || ref.ref_name}</div>
                                            ):(
                                                (!this.state.bibleReferenc) ? (
                                                <div>
                                                  <input 
                                                    type="text"
                                                    onChange={this.onChangeBible.bind(this)}
                                                    value={this.state.biblename}
                                                    name="biblename"                                                    
                                                  />
                                                  <div style={{marginLeft: "22%"}}>
                                                    <a
                                                      title="Rename"
                                                      style={{ paddingRight: "4px" }}
                                                      href="javascript:void(0);"
                                                      className="edit-ref"
                                                      data-rename={ref.ref_name}
                                                      value={this.state.myBible}
                                                      onClick={this.onReferenceSave.bind(this)}>Save
                                                    </a>
                                                    <span>|</span>
                                                    <a
                                                      title="Remove"
                                                      style={{ paddingLeft: "4px" }}
                                                      href="javascript:void(0);"
                                                      className="remove-ref"
                                                      data-remove={ref.ref_name}
                                                      onClick={() => this.onReferenceCancel(ref.ref_name)}>Cancel
                                                    </a>
                                                  </div>
                                                </div>
                                                ) : (<div>false</div>)
                                              )
                                        }                         
                                      </td>
                                      <td>{ref_first}</td>
                                      <td>{ref_except_first}</td>
                                      <td>
                                        {<div>
                                          <a
                                            title="Rename"
                                            style={{ paddingRight: "4px" }}
                                            href="javascript:void(0);"
                                            className="edit-ref"
                                            data-rename={ref.ref_name}
                                            onClick={() => this.onReferenceRename(ref.ref_name)}>Rename
                                          </a>
                                          <span>|</span>
                                          <a
                                            title="Remove"
                                            style={{ paddingLeft: "4px" }}
                                            href="javascript:void(0);"
                                            className="remove-ref"
                                            data-remove={ref_first+'_'+ref_except_first}
                                            onClick={() => this.onReferenceRemove(ref_first+'_'+ref_except_first)}>Remove
                                          </a>
                                        </div>}
                                      </td>
                                    </tr>
                                  );
                                })
                              }
                              { 
                                refList.map((ref, index) => {
                                  let ref_first = ref.ref_id.substr(0, ref.ref_id.indexOf('_'));
                                  let ref_except_first =  ref.ref_id.substr(ref.ref_id.indexOf('_')+1);
                                  return(
                                    <tr key={index}>
                                      <td>{ref.ref_name}</td>
                                      <td>{ref_first}</td>
                                      <td>{ref_except_first}</td>
                                      <td>{}</td>
                                    </tr>
                                  );
                                })
                              }
                            </tbody>
                          </table>
                        </div>
                      </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Modal.Body>
      </Modal>
    )
  }
}

module.exports = SettingsModal
