import React from 'react';
import ReactDOM from 'react-dom';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
const session =  require('electron').remote.session;
const Constant = require("../util/constants")
import { dialog } from 'electron';
import { remote } from 'electron';
const refDb = require(`${__dirname}/../util/data-provider`).referenceDb();
const Modal = require('react-bootstrap/lib/Modal');
const Button = require('react-bootstrap/lib/Button');
const Col = require('react-bootstrap/lib/Col');
const Row = require('react-bootstrap/lib/Row')
const Grid = require('react-bootstrap/lib/Grid')
const Nav = require('react-bootstrap/lib/Nav');
const NavItem = require('react-bootstrap/lib/NavItem');
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import TodoStore from "./TodoStore"


var AboutUsModel = function(props) {
    let closeAboutUs = () => TodoStore.showModalAboutUs = false
    return (  
    <Modal show={props.show} onHide={closeAboutUs} id="tab-about">
        <Modal.Header closeButton>
            <Modal.Title>About</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                <Tab eventKey={1} title="Overview"><div className="row">
                    <div className="col-xs-6">
                            <img src="../assets/images/autographa_lite_large.png" className="img-circle" alt="Cinque Terre" width="215" height="200" />
                        </div>
                        <div className="col-xs-6">
                            <h3>Autographa Lite</h3>
                            <p>Version 0.1</p>
                            <p>Source code hosted at: https://github.com/Bridgeconn/autographa-lite</p>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey={2} title="License">
                    <div style={{overflowY: "scroll", height: "255px"}}>
                        <h4> The MIT License (MIT)</h4>
                        <p>Released in 2017 by Friends of Agape (www.friendsofagape.org) in partnership with RUN Ministries (www.runministries.org). </p>
                        <br />
                        <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
                        <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
                        <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
                    </div>
                </Tab>
            </Tabs>
        </Modal.Body>
    </Modal>
    )
}



module.exports = AboutUsModel