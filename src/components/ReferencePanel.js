import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
const bootstrap = require('react-bootstrap');
const Modal = require('react-bootstrap/lib/Modal');
const Button = require('react-bootstrap/lib/Button');
const Col = require('react-bootstrap/lib/Col');
const Tabs = require('react-bootstrap/lib/Tabs');
const Tab = require('react-bootstrap/lib/Tab');
const Constant = require("../util/constants");
const refDb = require(`${__dirname}/../util/data-provider`).referenceDb();
const session =  require('electron').remote.session;
import { dialog, remote } from 'electron';
import { observer } from "mobx-react"
import AutographaStore from "./AutographaStore"
import Reference from "./Reference"

@observer
class ReferencePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { verses: [], refContent: '', refList: [], scriptDir: "LTR" }
        session.defaultSession.cookies.get({ url: 'http://refs.autographa.com' }, (error, refCookie) => {
            if(refCookie.length > 0){
                AutographaStore.refId = refCookie[0].value;
            }
        });
        session.defaultSession.cookies.get({ url: 'http://book.autographa.com' }, (error, bookCookie) => {
            if(bookCookie.length > 0){
                AutographaStore.bookId = bookCookie[0].value;
            }
        });
        session.defaultSession.cookies.get({ url: 'http://chapter.autographa.com' }, (error, chapterCookie) => {
            if(chapterCookie.length > 0){
                AutographaStore.chapterId = chapterCookie[0].value;
            }
        });
    }
    render (){
        const tIns = AutographaStore.tIns;
        const tDel = AutographaStore.tDel;
        return (        
            <div className="container-fluid">
                <div className="row row-col-fixed rmvflex" style={{display: 'flex'}}>
                    <div className="col-sm-12 col-fixed" id="section-0"> 
                    {/*<span style={{color: '#27b97e', fontWeight: 'bold'}}>(+) {tIns}</span> | <span style={{color: '#f50808', fontWeight: 'bold'}}> (-) {tDel}</span>*/}
                        <div dangerouslySetInnerHTML={{__html: this.props.refContent}} ></div>
                    </div>
                </div>
            </div>
        ) 
    }
}
module.exports = ReferencePanel