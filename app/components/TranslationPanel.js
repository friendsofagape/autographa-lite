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
import TodoStore from "./TodoStore"
import Reference from "./Reference"

@observer
class TranslationPanel extends React.Component {
    constructor(props) {
        super(props);
        //  this.handleRefChange = this.handleRefChange.bind(this);
        //this.saveTarget = this.saveTarget.bind(this);
        this.state = { verses: [], refContent: '', refList: [] }

         
        

        session.defaultSession.cookies.get({ url: 'http://refs.autographa.com' }, (error, refCookie) => {
            if(refCookie.length > 0){
                TodoStore.refId = refCookie[0].value;
            }
        });
        session.defaultSession.cookies.get({ url: 'http://book.autographa.com' }, (error, bookCookie) => {
            if(bookCookie.length > 0){
                TodoStore.bookId = bookCookie[0].value;
            }
        });
        session.defaultSession.cookies.get({ url: 'http://chapter.autographa.com' }, (error, chapterCookie) => {
            if(chapterCookie.length > 0){
                TodoStore.chapterId = chapterCookie[0].value;
            }
        });
    }

  //   componentWillUpdate(nextProps, nextState) {
  //    {this.nextProps.refContent}
  // }


    // getRefContents(id, chapter) {
    //     let refContent = refDb.get(id).then(function(doc) { //book code is hard coded for now
    //         for (var i = 0; i < doc.chapters.length; i++) {
    //             if (doc.chapters[i].chapter == parseInt(chapter, 10)) { // 1 is chapter number and hardcoded for now
    //                 break;
    //             }
    //         }
    //     let refString = doc.chapters[i].verses.map(function(verse, verseNum) {
    //         return '<div data-verse="r' + (verseNum + 1) + '"><span class="verse-num">' + (verseNum + 1) + '</span><span>' + verse.verse + '</span></div>';
    //     }).join('');
    //     return refString;
    //     }).catch(function(err) {
    //         console.log(err)
    //     });
    //     refContent.then((content)=> {
    //          TodoStore.content = content;
    //     });
    // }

    
	render (){
         // var translationContent = TodoStore.translationContent;
         // const refContent = TodoStore.content;
         // const refContentOne = TodoStore.contentOne; 
		return (
		
        <div className="container-fluid">
            <div className="row row-col-fixed rmvflex" style={{display: 'flex'}}>
                <div className="col-sm-12 col-fixed" id="section-0">                       
                    <div className="row">
                        <div type="ref" className="col-12 col-ref ref-contents">
                            {/*<Reference refId = {TodoStore.refId}/>*/}
                            {/*<h2 className="header-title-right wow fadeInRight" dangerouslySetInnerHTML={{__html: props.text}} />*/}
                           <div dangerouslySetInnerHTML={{__html: this.props.refContent}} ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

		) 

	}
}

module.exports = TranslationPanel