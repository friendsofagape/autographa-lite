import React from 'react';
import ReactDOM from 'react-dom';
import { RaisedButton, TextField, RadioButton, RadioButtonGroup, Checkbox } from 'material-ui';
import { observer } from "mobx-react"
import TodoStore from "./TodoStore";
import { dialog, remote } from 'electron';
import swal from 'sweetalert';
const refDb = require(`${__dirname}/../util/data-provider`).referenceDb();
const db = require(`${__dirname}/../util/data-provider`).targetDb();
const { Tabs, Tab, Modal, Button, Col, Row, ControlLabel,Grid, Radio, FormGroup } = require('react-bootstrap/lib');
const session = require('electron').remote.session;
const constants = require("../util/constants");
let bibUtil = require("../util/json_to_usfm.js");

@observer
class DownloadModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModalDownload: this.props.show,
            stageChange: '',
            buttonStage: 'Choose Stage'
        };
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }
  
    clickStage = (e) => {
        this.setState({ buttonStage: e, stageChange: e });
    }
    
    exportUsfm = (e) => {
        let stageInput = this.state.stageChange;
        session.defaultSession.cookies.get({ url: 'http://book.autographa.com' }, (error, cookie) => {
            if (error) {
                swal("Error", "Please enter Translation Details in the Settings to continue with Export.", "error");
            }
            let book = {};
            db.get('targetBible').then(function(doc) {
                book.bookNumber = cookie[0].value;
                book.bookName = constants.booksList[parseInt(book.bookNumber, 10) - 1];
                book.bookCode = constants.bookCodeList[parseInt(book.bookNumber, 10) - 1];
                book.outputPath = doc.targetPath;
                let filepath = bibUtil.toUsfm(book, stageInput, doc);
                return filepath;
            }).then((filepath) => {
                TodoStore.showModalDownload = false;
                swal("Book Exported", "Exported file at : " + filepath); 
            }).catch((err) => {
                swal("Error", "Cannot get details from DB", "error");
            });
        });
    }

    render (){
        let closeSearchUSFM = () => TodoStore.showModalDownload = false
        return ( 
            <Modal show={TodoStore.showModalDownload} onHide={closeSearchUSFM} id="tab-search">
                <Modal.Header closeButton>
                    <Modal.Title id="export-heading">Export as USFM</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="input-group">
                            <input 
                                type="text"
                                className="form-control"
                                id="stageText" 
                                placeholder="Stage name of translation"
                                name="stageChange"
                                value={this.state.stageChange}
                                onChange={this.onChange}
                            />
                            <div className="input-group-btn">
                                <button 
                                    id="dropdownBtn"
                                    type="button"
                                    className="btn btn-default dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false">{this.state.buttonStage} 
                                    <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-right" id="trans-stage">
                                    <li>
                                        <a href="#" value="stage1" onClick={() => this.clickStage("Stage 1")}>
                                            <span className="stage">Stage </span> 1 
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" value="stage2" onClick={() => this.clickStage("Stage 2")}>
                                            <span className="stage">Stage </span> 2 
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" value="stage3" onClick={() => this.clickStage("Stage 3")}>
                                            <span className="stage">Stage </span> 3
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" value="stage4" onClick={() => this.clickStage("Stage 4")}>
                                            <span className="stage">Stage </span> 4
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" value="stage5" onClick={() => this.clickStage("Stage 5")}>
                                            <span className="stage">Stage </span> 5
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                </Modal.Body>
                <Modal.Footer>
                <RaisedButton style={{float: "right"}} label="Export" primary={true} onClick={(e) => this.exportUsfm(e)}/>
                </Modal.Footer>
            </Modal>
        )
    }
}

module.exports = DownloadModal
