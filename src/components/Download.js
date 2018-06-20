import React from 'react';
import ReactDOM from 'react-dom';
import { RaisedButton, TextField, RadioButton, RadioButtonGroup, Checkbox } from 'material-ui';
import { observer } from "mobx-react"
import AutographaStore from "./AutographaStore";
import { dialog, remote } from 'electron';
import swal from 'sweetalert';
const refDb = require(`${__dirname}/../util/data-provider`).referenceDb();
const db = require(`${__dirname}/../util/data-provider`).targetDb();
const { Tabs, Tab, Modal, Button, Col, Row, ControlLabel,Grid, Radio, FormGroup } = require('react-bootstrap/lib');
const session = require('electron').remote.session;
const constants = require("../util/constants");
let bibUtil = require("../util/json_to_usfm.js");
import { FormattedMessage } from 'react-intl';

@observer
class DownloadModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stageName: '',
            stageChange: '',
            buttonStage: 'dynamic-msg-stage-trans',
            
        }
    }
    onChange = (e) => { 
        this.setState({stageName: e.target.value, stageChange: ''})
    }
  
    clickStage = (e) => {
        this.setState({ buttonStage: "label-stage", stageChange: e, stageName: '' });
    }
    
    exportUsfm = (e) => {
        const {stageChange, stageName} = this.state;
        let stageInput = stageName ? stageName : `Stage ${stageChange}`;
        let book = {};
        const currentTrans = AutographaStore.currentTrans;
        db.get('targetBible').then(function(doc) {
            book.bookNumber = AutographaStore.bookId.toString();
            book.bookName = constants.booksList[parseInt(book.bookNumber, 10) - 1];
            book.bookCode = constants.bookCodeList[parseInt(book.bookNumber, 10) - 1];
            book.outputPath = doc.targetPath;
            let filepath = bibUtil.toUsfm(book, stageInput, doc);
            return filepath;
        }).then((filepath) => {
            AutographaStore.showModalDownload = false;
            swal({title: currentTrans["tooltip-export-usfm"], text: `${currentTrans["label-exported-file"]}:${filepath}`})
        }).catch((err) => {
            console.log(err)
            AutographaStore.showModalDownload = false;
            swal(currentTrans["dynamic-msg-error"], currentTrans["dynamic-msg-enter-translation"])
        });
    }

    render (){
        let closeSearchUSFM = () => AutographaStore.showModalDownload = false
        const {stageChange, stageName} = this.state;
        return ( 
            <Modal show={AutographaStore.showModalDownload} onHide={closeSearchUSFM} id="tab-search">
                <Modal.Header closeButton>
                    <Modal.Title id="export-heading"><FormattedMessage id="tooltip-export-usfm" /></Modal.Title>
                </Modal.Header>
                <Modal.Body>
              
                <div className="row">
                    <div className="col-lg-9">
                        <div className="input-group">
                            <FormattedMessage id="placeholder-stage-trans">
                            {(message) =>
                            <input 
                                type="text"
                                className="form-control"
                                id="stageText" 
                                placeholder={message}
                                name="stageChange"
                                value={ stageName ? stageName : (stageChange ? `Stage ${stageChange}` : "")}
                                onChange={this.onChange}
                            />}
                            </FormattedMessage>
                            <div className="input-group-btn">
                                <button 
                                    id="dropdownBtn"
                                    type="button"
                                    className="btn btn-default dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"><FormattedMessage id={this.state.buttonStage} />&nbsp;{this.state.stageChange} 
                                    <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-right" id="trans-stage">
                                    <li>

                                        <a href="#"  onClick={() => this.clickStage("1")}>
                                            <span className="stage"><FormattedMessage id="label-stage" /> </span> 1 
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"  onClick={() => this.clickStage("2")}>
                                            <span className="stage"><FormattedMessage id="label-stage" /> </span> 2 
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"  onClick={() => this.clickStage("3")}>
                                            <span className="stage"><FormattedMessage id="label-stage" /> </span> 3
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"  onClick={() => this.clickStage("4")}>
                                            <span className="stage"><FormattedMessage id="label-stage" /> </span> 4
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"  onClick={() => this.clickStage("5")}>
                                            <span className="stage"><FormattedMessage id="label-stage" /> </span> 5
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                </Modal.Body>
                <Modal.Footer>
                <FormattedMessage id="btn-export">
                {(message) =>
                  <RaisedButton style={{float: "right"}} disabled={stageName || stageChange ? false : true} id="btn-export-usfm" label={message} primary={true} onClick={(e) => this.exportUsfm(e)}/>
                }
                </FormattedMessage>
                </Modal.Footer>
            </Modal>
        )
    }
}

module.exports = DownloadModal
