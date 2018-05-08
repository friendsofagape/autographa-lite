import React from 'react';
import ReactDOM from 'react-dom';
import { dialog, remote } from 'electron';
import { observer } from "mobx-react"
import AutographaStore from "./AutographaStore"
const { Modal, Button, Col, Tabs, Tab } = require('react-bootstrap/lib');
const Constant = require("../util/constants");
const refDb = require(`${__dirname}/../util/data-provider`).referenceDb();
const session = require('electron').remote.session;
const i18n = new(require('../translations/i18n'));

@observer
class TranslationPanel extends React.Component {
  constructor(props){
    super(props);
    i18n.isRtl().then((res) => {
      if(res) AutographaStore.scriptDirection = "rtl"
    });
    this.timeout =  0;
  }

  highlightRef(obj) {
    {/*var content = ReactDOM.findDOMNode(this);
    let verses = content.getElementsByClassName("verse-input")[0].querySelectorAll("span[id^=v]");
    var refContent = document.getElementsByClassName('ref-contents');
    for (var a=0; a< refContent.length; a++) {
      var refContent2 = refContent[a];
      for (var i = 0; i < AutographaStore.verses.length; i++) {
        var refDiv = refContent2.querySelectorAll('div[data-verse^='+'"'+"r"+(i+1)+'"'+']');
        if (refDiv != 'undefined') {
          refDiv[0].style="background-color:none;font-weight:none;padding-left:10px;padding-right:10px";
        }            
      };
      let chunk = document.getElementById(obj).getAttribute("data-chunk-group");
      if (chunk) {
        refContent2.querySelectorAll('div[data-verse^="r"]').style="background-color: '';font-weight: '';padding-left:10px;padding-right:10px";
        var limits = chunk.split("-").map(function(element) { return parseInt(element, 10) - 1; });
        for(var j=limits[0]; j<=limits[1];j++){
          refContent2.querySelectorAll("div[data-verse=r"+(j+1)+"]")[0].style = "background-color: rgba(11, 130, 255, 0.1);padding-left:10px;padding-right:10px;margin-right:10px";
        }
        $('div[data-verse="r' + (limits[0] + 1) + '"]').css({ "border-radius": "10px 10px 0px 0px" });
        $('div[data-verse="r' + (limits[1] + 1) + '"]').css({ "border-radius": "0px 0px 10px 10px" });
      }
    }*/}           
  }

  handleKeyUp =(e)=> {
    if(this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.onSave();
    }, 3000);
  }
  
  render (){
    var verseGroup = [];
    for (var i = 0; i < AutographaStore.chunkGroup.length; i++) {
      var vid="v"+(i+1);  
      verseGroup.push(<div key={i} onClick={this.highlightRef.bind(this, vid)}>
          <span className='verse-num' key={i}>{(i+1)}</span>
          <span contentEditable={true} suppressContentEditableWarning={true} id={vid} data-chunk-group={AutographaStore.chunkGroup[i]} onKeyUp={this.handleKeyUp}>
          {AutographaStore.translationContent[i]}
          </span>
        </div>
      ); 
    }
    const {tIns, tDel} = this.props;
    return (
      <div className="col-editor container-fluid">
        <div className="row">
          <div className="col-12 center-align">
              <p className="translation">Translation</p>
          </div>
        </div>
        <div className="row">
          {tIns || tDel ? <div style={{textAlign: "center"}}><span style={{color: '#27b97e', fontWeight: 'bold'}}>(+) {tIns}</span> | <span style={{color: '#f50808', fontWeight: 'bold'}}> (-) {tDel}</span></div> : "" }
          <div id="input-verses" className={`col-12 col-ref verse-input ${AutographaStore.scriptDirection.toLowerCase()}`} dir={AutographaStore.scriptDirection}>{verseGroup}</div>
        </div>
      </div>
    ) 
  }
}

module.exports = TranslationPanel;