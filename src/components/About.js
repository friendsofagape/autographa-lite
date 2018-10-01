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
import AutographaStore from "./AutographaStore" 
import { FormattedMessage } from 'react-intl';

var AboutUsModel = function(props) {
    let closeAboutUs = () => AutographaStore.showModalAboutUs = false
    return (  
    <Modal show={props.show} onHide={closeAboutUs} id="tab-about">
        <Modal.Header closeButton>
            <Modal.Title><FormattedMessage id="tooltip-about" /></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                <Tab eventKey={1} title={<FormattedMessage id="label-overview-tab"/>}>
                    <div className="row">
                        <div className="col-xs-6">
                            <img src="../assets/images/autographa_lite_large.png" className="img-circle" alt="Cinque Terre" width="215" height="200" />
                        </div>
        <div className="col-xs-6" style={{padding:"5px"}}>
                            <h3><FormattedMessage id="app-name-Autographa-Lite" /></h3>
                            <p><FormattedMessage id="label-version" /> <span>1.2.3</span></p>
        <p><FormattedMessage id="label-hosted-url" /></p>
	<p>https://github.com/friendsofagape/autographa-lite.git</p>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey={2} title={<FormattedMessage id="label-license-tab"/>}>
                    <div style={{overflowY: "scroll", height: "255px"}}>
                        <h4> The MIT License (MIT)</h4>
                        <p>Released in 2018 by Friends of Agape (www.friendsofagape.org) in partnership with RUN Ministries (www.runministries.org). </p>
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
