import React from 'react';
import { observer } from "mobx-react"
import AutographaStore from "./AutographaStore"
import Statistic  from '../components/Statistic';
import { FormattedMessage } from 'react-intl';
const i18n = new(require('../translations/i18n'));
const db = require(`${__dirname}/../util/data-provider`).targetDb();

@observer
class TranslationPanel extends React.Component {
	constructor(props){
    	super(props);
   		i18n.isRtl().then((res) => {
      		if(res) AutographaStore.scriptDirection = "rtl"
    	});
   		this.timeout =  0;
  	}

  	highlightRef(vId, refId, obj) {
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
        // document.getElementById(vId).addEventListener("paste", function (e) {
		// 	e.preventDefault();
		// 	var text = e.clipboardData.getData("text/plain");
		// 	document.execCommand("insertHTML", false, text);
		// })
      	let refContent = document.getElementsByClassName('ref-contents');
      	for(let l=0; l<AutographaStore.layout; l++){
        	let ref = refContent[l] ? refContent[l].querySelectorAll('div[data-verse^="r"]') : [];
        	for (let i=0; i < ref.length; i++) {
          		if (ref[i] != 'undefined') {
            		ref[i].style="background-color:none;font-weight:none;padding-left:10px;padding-right:10px";
          		}
        	};
        	if( refContent[l])
          		refContent[l].querySelectorAll('div[data-verse^='+'"'+"r"+(refId+1)+'"'+']')[0].style = "background-color: rgba(11, 130, 255, 0.1);padding-left:10px;padding-right:10px;border-radius: 10px";
        }
        let focusIn = document.getElementById(vId);
        focusIn.focus();
    }

	handleKeyUp =(e)=> {
		if(this.timeout) clearTimeout(this.timeout);
			this.timeout = setTimeout(() => {
				if(!AutographaStore.setDiff){
					this.props.onSave();
				}
			}, 3000);
	}
  	openStatPopup =() => {
        this.showReport();
        AutographaStore.showModalStat = true
    }
    showReport = () => {
        let emptyChapter = [];
        let incompleteVerseChapter = {};
        let multipleSpacesChapter = {};     
        db.get(AutographaStore.bookId.toString()).then((doc) =>{
            doc.chapters.forEach((chapter) => {
                let emptyVerse = [];
                let verseLength = chapter.verses.length;
                let incompleteVerse = [];
                let multipleSpaces = [];
                for(let i=0; i < verseLength; i++){
                    let verseObj = chapter.verses[i];
                    let checkSpace = verseObj["verse"].match(/\s\s+/g, ' ');
                    if(verseObj["verse"].length == 0){
                        emptyVerse.push(i);
                    }
                    else if(verseObj["verse"].length > 0 && verseObj["verse"].trim().split(" ").length === 1){
                        incompleteVerse.push(verseObj["verse_number"])
                    }
                    else if(checkSpace != null && checkSpace.length > 0) {
                        multipleSpaces.push(verseObj["verse_number"])
                    }
                }
                if(incompleteVerse.length > 0){
                    incompleteVerseChapter[chapter["chapter"]] = incompleteVerse;
                }
                if(multipleSpaces.length > 0){
                    multipleSpacesChapter[chapter["chapter"]] = multipleSpaces;
                }
                if(emptyVerse.length === verseLength){
                    emptyChapter.push(chapter["chapter"])
                }
            })
            AutographaStore.emptyChapter = emptyChapter;
            AutographaStore.incompleteVerse = incompleteVerseChapter;
            AutographaStore.multipleSpaces = multipleSpacesChapter;      
        })  
    }
  
  	render (){
    	let verseGroup = [];
    	const toggle = AutographaStore.toggle;

		for (let i = 0; i < AutographaStore.chunkGroup.length; i++) {
		let vid="v"+(i+1);
		verseGroup.push(<div key={i} id={`versediv${i+1}`} onClick={this.highlightRef.bind(this, vid, i)} style={{cursor: "text", whiteSpace: "pre-wrap"}}>
			<span className='verse-num' key={i}>{(i+1)}</span>
			<span contentEditable={true} suppressContentEditableWarning={true} id={vid} data-chunk-group={AutographaStore.chunkGroup[i]} onKeyUp={this.handleKeyUp}>
			{AutographaStore.translationContent[i]}
			</span>
			</div>
		); 
		}
		const {tIns, tDel} = this.props;
		return (
			<div className="col-editor container-fluid trans-margin">
				<div className="row">
				<div className="col-12 center-align">
					<p className="translation"><a href="javscript:;" style = {{fontWeight: "bold", pointerEvents: toggle ? "none" : "" }} onClick={() => this.openStatPopup()}><FormattedMessage id="label-translation" /></a></p>
				</div>
				</div>
				<div className="row">
				{tIns || tDel ? <div style={{textAlign: "center"}}><span style={{color: '#27b97e', fontWeight: 'bold'}}>(+) <span id="tIns">{tIns}</span></span> | <span style={{color: '#f50808', fontWeight: 'bold'}}> (-) <span id="tDel">{tDel}</span></span></div> : "" }
				<div id="input-verses" className={`col-12 col-ref verse-input ${AutographaStore.scriptDirection.toLowerCase()} ${tIns || tDel ? 'disable-input' : ''}`} dir={AutographaStore.scriptDirection} style={{pointerEvents: tIns || tDel ? 'none': ''}}>{verseGroup}</div>
				</div>
				<Statistic show={AutographaStore.showModalStat}  showReport = {this.showReport}/>
			</div>
		) 
  	}
}

module.exports = TranslationPanel;