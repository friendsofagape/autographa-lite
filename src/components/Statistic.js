import React from 'react';
import ReactDOM from 'react-dom';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
const session =  require('electron').remote.session;
const Constant = require("../util/constants");
import { dialog } from 'electron';
import { remote } from 'electron';
import { observer } from "mobx-react"
import * as mobx from 'mobx'
const refDb = require(`${__dirname}/../util/data-provider`).referenceDb();
const db = require(`${__dirname}/../util/data-provider`).targetDb();
const Modal = require('react-bootstrap/lib/Modal');
const Button = require('react-bootstrap/lib/Button');
const Col = require('react-bootstrap/lib/Col');
const Row = require('react-bootstrap/lib/Row')
const Grid = require('react-bootstrap/lib/Grid')
const Nav = require('react-bootstrap/lib/Nav');
const NavItem = require('react-bootstrap/lib/NavItem');
import AutographaStore from "./AutographaStore" 
import { FormattedMessage } from 'react-intl';
const numberFormat = require("../util/getNumberFormat")

@observer
class Statistic extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            emptyChapter: [],
            incompleteVerse: []
        }
        
    }
    render () {
        let close = () => AutographaStore.showModalStat = false
        const incompleteVerse = mobx.toJS(AutographaStore.incompleteVerse);
        const multipleSpaces = mobx.toJS(AutographaStore.multipleSpaces);
        const emptyChapters = mobx.toJS(AutographaStore.emptyChapter)
        const bookName = Constant.booksList[parseInt(AutographaStore.bookId, 10) - 1]
        const { show } = this.props;
        
        return (  
        <Modal show={show} onHide={close} id="tab-about">
            <Modal.Header closeButton>
                <Modal.Title>Statistics for the book of {bookName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <div className="panel  panel-default">
                  <div className="panel-heading">
                    Empty Chapters
                  </div>
                  <div className="panel-body">
                    <span>{`${numberFormat.getNumberFormat(emptyChapters)} `}</span>
                  </div>
                </div>

                <div className="panel  panel-default">
                  <div className="panel-heading">
                    Incomplete Verses
                  </div>
                  <div className="panel-body">
                    {
                        Object.keys(incompleteVerse).map((key, i) => {
                            return (<span key={"c"+i}><span>{key}:</span><span>{`${numberFormat.getNumberFormat(incompleteVerse[key])}`}{  Object.keys(incompleteVerse).length > i+1 ? ";" : ""} </span></span>)
                        })
                    }
                  </div>
                </div>
                <div className="panel  panel-default">
                  <div className="panel-heading">
                    Multiple Spaces
                  </div>
                  <div className="panel-body">
                    {
                        Object.keys(multipleSpaces).map((key, i) => {
                            return (<span key={"c"+i}><span>{key}:</span><span>{`${numberFormat.getNumberFormat(multipleSpaces[key])} `}{  Object.keys(multipleSpaces).length > i+1 ? ";" : ""}</span></span>)
                        })
                    }
                  </div>
                </div>
            </Modal.Body>
        </Modal>
        )
    }
}

module.exports = Statistic
