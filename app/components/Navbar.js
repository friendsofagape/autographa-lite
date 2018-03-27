import React from 'react';
import ReactDOM from 'react-dom';
const { Nav, NavItem, Modal, Button, Col, Row, Grid, Tabs, Tab } = require('react-bootstrap/lib');
const Constant = require("../util/constants");
const session = require('electron').remote.session;
import { observer } from "mobx-react"
import TodoStore from "./TodoStore"
import SettingsModal from "./Settings"
import AboutUsModal from "./About"
import SearchModal from "./Search"
import DownloadModal from "./Download"
import TranslationPanel  from '../components/TranslationPanel';
const refDb = require(`${__dirname}/../util/data-provider`).referenceDb();
const db = require(`${__dirname}/../util/data-provider`).targetDb();
const injectTapEventPlugin = require("react-tap-event-plugin");
import  ReferencePanel  from '../components/ReferencePanel';
import  Footer  from '../components/Footer';
import Reference from "./Reference";
import { FormattedMessage } from 'react-intl';
import { Toggle } from 'material-ui';


let exportHtml = require(`${__dirname}/../util/export_html.js`);
let currentBook, book;

injectTapEventPlugin();

@observer
class Navbar extends React.Component {
    constructor(props) {
      super(props);
        this.handleRefChange = this.handleRefChange.bind(this);
        this.getData = this.getData.bind(this);
        this.state = {
            showModal: false,
            showModalSettings: false,
            showModalSearch: false,
            showModalDownload: false,
            data: Constant,
            chapData: [],
            bookNo:1,
            defaultRef: 'eng_ulb',
            defaultRefOne: 'eng_ulb',
            refList: [],
            searchVal: "", 
            replaceVal:"",
        };
       
        var verses, chunks, chapter;
        var that = this;
        refDb.get("ref_history").then(function(doc) {
            var bookName = doc.visit_history[0].book; 
            var book = doc.visit_history[0].bookId;
            chapter = doc.visit_history[0].chapter;
            TodoStore.bookId = book.toString();
            TodoStore.chapterId = chapter;
            TodoStore.verses = verses;
            db.get(TodoStore.bookId).then(function(doc) {
                refDb.get('refChunks').then(function(chunkDoc) {
                    TodoStore.verses = doc.chapters[parseInt(TodoStore.chapterId, 10) - 1].verses;
                    TodoStore.chunks = chunkDoc.chunks[parseInt(TodoStore.bookId, 10) - 1];
                    chapter = TodoStore.chapterId
                    that.getRefContents(TodoStore.activeRefs[0]+'_'+Constant.bookCodeList[parseInt(TodoStore.bookId, 10) - 1],chapter.toString());
                })
            })
        }).catch(function(err) {
            TodoStore.bookId = "1";
            TodoStore.chapterId = "1";
            console.log(err)
        });                  
    }
    getContent = (id, chapter) => {
        return refDb.get(id).then( (doc) => { 
            for (var i = 0; i < doc.chapters.length; i++) {
                if (doc.chapters[i].chapter == parseInt(chapter, 10)) { 
                    break;
                }
            }
            let refString = doc.chapters[i].verses.map((verse, verseNum) => {
                return `<div type="ref" class="col-12 col-ref ref-contents ${doc.scriptDirection.toLowerCase()}" dir=${doc.scriptDirection}><div data-verse=r${(verseNum + 1)}><span class="verse-num"> ${doc.scriptDirection == "LTR" ? (verseNum + 1) : (verseNum + 1).toLocaleString('ar')} </span><span> ${verse.verse}</span></div></div`;
            }).join('');
            return refString;
        }, (err) => {
            console.log(err)
        });
    }

    getRefContents = (id,chapter) => {

        refDb.get('targetReferenceLayout').then((doc) => {
            TodoStore.layout = doc.layout;
            TodoStore.layoutContent = doc.layout;
            let chapter = TodoStore.chapterId.toString();
            switch(doc.layout){
                case 1:
                    this.getContent(TodoStore.activeRefs[0]+'_'+Constant.bookCodeList[parseInt(TodoStore.bookId, 10) - 1],chapter).then((content)=>{
                        TodoStore.content = content;
                    })
                case 2:
                    this.getContent(TodoStore.activeRefs[0]+'_'+Constant.bookCodeList[parseInt(TodoStore.bookId, 10) - 1],chapter).then((content)=>{
                        TodoStore.content = content;
                    }) 
                    this.getContent(TodoStore.activeRefs[1]+'_'+Constant.bookCodeList[parseInt(TodoStore.bookId, 10) - 1],chapter).then((content)=>{
                        TodoStore.contentOne = content;
                    })
                case 3:
                    this.getContent(TodoStore.activeRefs[0]+'_'+Constant.bookCodeList[parseInt(TodoStore.bookId, 10) - 1],chapter).then((content)=>{
                        TodoStore.content = content;
                    }) 
                    this.getContent(TodoStore.activeRefs[1]+'_'+Constant.bookCodeList[parseInt(TodoStore.bookId, 10) - 1],chapter).then((content)=>{
                        TodoStore.contentOne = content;
                    })
                    this.getContent(TodoStore.activeRefs[2]+'_'+Constant.bookCodeList[parseInt(TodoStore.bookId, 10) - 1],chapter).then((content)=>{
                        TodoStore.contentTwo = content;
                    })
            }
        })
       //  TodoStore.aId  = "";
        var translationContent = [];
        var i;
        var chunkIndex = 0;
        var chunkVerseStart; 
        var chunkVerseEnd;
        var chunkGroup = [];
        var chunks = TodoStore.chunks;
        var verses = TodoStore.verses;
        for (i = 0; i < chunks.length; i++) {
            if (parseInt(chunks[i].chp, 10) === parseInt(chapter, 10)) {
                chunkIndex = i + 1;
                chunkVerseStart = parseInt(chunks[i].firstvs, 10);
                chunkVerseEnd = parseInt(chunks[i + 1].firstvs, 10) - 1;
                break;
            }
        }

        for (i = 1; i <= verses.length; i++) {
            var spanVerseNum = '';
            if (i > chunkVerseEnd) {
                chunkVerseStart = parseInt(chunks[chunkIndex].firstvs, 10);
                if (chunkIndex === chunks.length - 1 || parseInt((chunks[chunkIndex + 1].chp), 10) != chapter) {
                    chunkVerseEnd = verses.length;
                    
                } else {
                    chunkIndex++;
                    chunkVerseEnd = parseInt(chunks[chunkIndex].firstvs, 10) - 1;
                }
            }
            var chunk = chunkVerseStart + '-' + chunkVerseEnd;
            translationContent.push(verses[i - 1].verse).toString();
            var spanVerse = chunk 
            chunkGroup.push(spanVerse);
        }

        TodoStore.chunkGroup = chunkGroup;
        TodoStore.translationContent= translationContent;
    }

    openpopupSettings() {
        TodoStore.showModalSettings = true
    }

    openpopupSearch() {
        TodoStore.showModalSearch = true
    }

    openpopupDownload() {
        TodoStore.showModalDownload = true
    }

    exportPDF = (e, column) => {
        let id = TodoStore.currentRef + '_' + Constant.bookCodeList[parseInt(TodoStore.bookId, 10) - 1];
        db.get('targetBible').then((doc) => {
            db.get(TodoStore.bookId).then((book) => {
                exportHtml.exportHtml(id, book, db, doc.langScript, column);
            })
        }).catch(function(err) {
            // handle any errors
            swal("Error", "Please enter Translation Details in the Settings to continue with Export.", "error");
        });  
    }

    openpopupAboutUs() {
        TodoStore.showModalAboutUs = true
    }

    openpopupBooks(tab) {
        // event.persist();
         TodoStore.aId = tab;
        var chap = [];
        TodoStore.showModalBooks = true;
        TodoStore.activeTab = tab;
        TodoStore.bookActive = TodoStore.bookId;
        TodoStore.bookName = Constant.booksList[parseInt(TodoStore.bookId, 10) - 1] 
        TodoStore.chapterActive = TodoStore.chapterId;
        this.getData();
    }

    getData(){
        refDb.get(TodoStore.currentRef +"_"+ Constant.bookCodeList[parseInt(TodoStore.bookId, 10)-1]).then(function(doc) {
            TodoStore.bookChapter["chapterLength"] = doc.chapters.length;
            TodoStore.bookChapter["bookId"] = TodoStore.bookId;
        }).catch(function(err){
            console.log(err);
        })
    }

    onItemClick(bookName) {
        var bookNo;
        for (var i = 0; i < Constant.booksList.length; i++) {
            bookName == Constant.booksList[i]
            if (bookName == Constant.booksList[i]) {
                var bookNo = i+1;
                break;
            };
        };
        TodoStore.bookActive = bookNo;
        TodoStore.bookName = bookName;
        TodoStore.chapterActive = 0;
        var id = TodoStore.currentRef + '_' + Constant.bookCodeList[parseInt(bookNo, 10) - 1]
        var getData = refDb.get(id).then(function(doc) {
            return doc.chapters.length;
        }).catch(function(err){
            console.log(err);
        });
        getData.then((length) => {
            TodoStore.bookChapter["chapterLength"] = length;
            TodoStore.bookChapter["bookId"] = bookNo;
        });
    }

     
    handleSelect(key) {
        // this.setState({key});
    }

    goToTab(key) {
        var _this = this;
        TodoStore.activeTab = key;
    }

    getValue(chapter, bookId){
        TodoStore.translationContent = "";
        TodoStore.chapterId = chapter;
        TodoStore.bookId = bookId;
        var verses = TodoStore.verses;
        var chunks = TodoStore.chunks;
        this.saveLastVisit(bookId,chapter);
        const cookiechapter = { url: 'http://chapter.autographa.com', name: 'chapter' , value: chapter.toString() };
        session.defaultSession.cookies.set(cookiechapter, (error) => {
            if (error)
            console.log(error);
        });

        const cookieRef = { url: 'http://book.autographa.com', name: 'book' , value: bookId.toString() };
        session.defaultSession.cookies.set(cookieRef, (error) => {
            if (error)
            console.log(error);
        });

        session.defaultSession.cookies.get({ url: 'http://refs.autographa.com' }, (error, refCookie) => {
            if(refCookie.length > 0){
                var that = this;   
                var chapter;
                var bkId = TodoStore.bookId.toString();
                db.get(bkId).then(function(doc) {
                    refDb.get('refChunks').then(function(chunkDoc) {
                    TodoStore.verses = doc.chapters[parseInt(TodoStore.chapterId, 10) - 1].verses;
                    TodoStore.chunks = chunkDoc.chunks[parseInt(TodoStore.bookId, 10) - 1];
                    chapter = TodoStore.chapterId;
                    that.getRefContents(TodoStore.refId+'_'+Constant.bookCodeList[parseInt(TodoStore.bookId, 10) - 1],chapter.toString());
                    
                });
            })
            }else{
                var that = this; 
                var bkId = TodoStore.bookId.toString();  
                var chapter;
                TodoStore.bookName = Constant.booksList[parseInt(TodoStore.bookId, 10) - 1] 
                db.get(bkId).then(function(doc) {
                    console.log("else called")
                    refDb.get('refChunks').then(function(chunkDoc) {
                    TodoStore.verses = doc.chapters[parseInt(TodoStore.chapterId, 10) - 1].verses;
                    TodoStore.chunks = chunkDoc.chunks[parseInt(TodoStore.bookId, 10) - 1];
                    chapter = TodoStore.chapterId;
                    that.getRefContents('eng_ulb'+'_'+Constant.bookCodeList[parseInt(TodoStore.bookId, 10) - 1],chapter.toString());
                });
            })
            }    
        })
        TodoStore.showModalBooks = false;
    }

    saveLastVisit(book, chapter) {
        refDb.get('ref_history').then(function(doc) {
            doc.visit_history = [{ "book": TodoStore.bookName, "chapter": chapter, "bookId": book }]
            refDb.put(doc).then(function(response) {}).catch(function(err) {
            console.log(err);
            });
        });
    }

    getbookCategory(booksstart, booksend) {
        var booksCategory = [];
        for (var i = booksstart; i <= booksend; i++) {
            booksCategory.push(Constant.booksList[i]);
        };
        TodoStore.bookData = booksCategory;
    }
    formatDate = (date) => {
      let monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "June", "July",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
      ];

      let day = date.getDate();
      let monthIndex = date.getMonth();
      let year = date.getFullYear();
      let hours = date.getHours();
      let seconds = date.getSeconds();
      let minutes = date.getMinutes();
      minutes = minutes < 10 ? '0'+minutes : minutes;

      return hours+ ':' + minutes  
    }

    saveTarget = () => {
        let bookNo = TodoStore.bookId.toString();
        let that = this;
        let translationContent = [];
        db.get(bookNo).then((doc) => {
            let verses = doc.chapters[parseInt(TodoStore.chapterId, 10) - 1].verses;
            verses.forEach( (verse, index) => {
                let vId = 'v' + (index + 1);
                translationContent.push(document.getElementById(vId).textContent).toString();
                verse.verse = document.getElementById(vId).textContent;
                doc.chapters[parseInt(TodoStore.chapterId, 10) - 1].verses = verses;
            });
            db.get(doc._id).then((book) => {
                doc._rev = book._rev;
                db.put(doc).then((response) => {
                    let dateTime = new Date();
                    TodoStore.transSaveTime = that.formatDate(dateTime);
                    TodoStore.translationContent = translationContent;
                    clearInterval("#saved-time");
                }, (err) => {
                    db.put(doc).then((response) => {
                        let dateTime = new Date();
                        TodoStore.transSaveTime = that.formatDate(dateTime)
                        TodoStore.translationContent = translationContent;
                    },(err) => {
                        clearInterval("#saved-time");
                    });
                    clearInterval("#saved-time");
                });
            });

           
        }, (err) => {
            console.log('Error: While retrieving document. ' + err);
        });
    }

    handleRefChange(refDropDownPos, event) {
        // event.persist();
        TodoStore.activeRefs[refDropDownPos] = event.target.value;
        refDb.get('activeRefs').then((doc) => {
            doc._rev = doc._rev;
            doc.activeRefs = Object.assign(doc.activeRefs, TodoStore.activeRefs);
            refDb.put(doc);
        }, (err) => {
            refDb.put({_id: "activeRefs" , activeRefs: activeRefs}).then((res) => {
            }, (err) => {
                console.log(err);
            });
        });
        TodoStore.selectId = event.target.id;
        TodoStore.layoutContent = parseInt(event.currentTarget.dataset.layout);
        let referenceValue = event.target.value;
        TodoStore.currentRef = referenceValue;
        session.defaultSession.cookies.get({ url: 'http://book.autographa.com' }, (error, bookCookie) => {
            if(bookCookie.length > 0){
                this.getRefContents(referenceValue+'_'+Constant.bookCodeList[parseInt(bookCookie[0].value, 10) - 1],TodoStore.chapterId) 
            }else{
                this.getRefContents(referenceValue+'_'+Constant.bookCodeList[parseInt('1', 10) - 1],TodoStore.chapterId)
            }    
        })
        var cookieRef = { url: 'http://refs.autographa.com', name: '0' , value: event.target.value };
        session.defaultSession.cookies.set(cookieRef, (error) => {
            if (error)
            console.log(error);
        });

    } 
    
    render() {
        // const layout = TodoStore.layout;
        var OTbooksstart = 0;
        var OTbooksend = 38;
        var NTbooksstart= 39;
        var NTbooksend= 65;
        const bookData = TodoStore.bookData;
        const refContent = TodoStore.content; 
        const refContentOne = TodoStore.contentOne;
        const refContentCommon = TodoStore.contentCommon;
        const refContentTwo = TodoStore.contentTwo;
        const bookName = Constant.booksList[parseInt(TodoStore.bookId, 10) - 1]
        let close = () => TodoStore.showModalBooks = false;
        const test = (TodoStore.activeTab == 1);
        var chapterList = [];
        for(var i=0; i<TodoStore.bookChapter["chapterLength"]; i++){
            chapterList.push( <li key={i} value={i+1} ><a href="#"  className={(i+1 == TodoStore.chapterActive) ? 'link-active': ""} onClick = { this.getValue.bind(this,  i+1, TodoStore.bookChapter["bookId"]) } >{(i+1).toLocaleString(TodoStore.appLang)}</a></li> );
        }
        return (
            <div>
                <Modal show={TodoStore.showModalBooks} onHide = {close} id="tab-books">
                    <Modal.Header closeButton>
                        <Modal.Title>Book and Chapter</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tabs 
                            animation={false}
                            activeKey={TodoStore.activeTab}
                            onSelect={() =>this.goToTab(TodoStore.activeTab == 1? 2 : 1)} id="noanim-tab-example">
                            {
                                test ? (
                                <div className="wrap-center">
                                    <div className="btn-group" role="group" aria-label="...">
                                        <button 
                                            className="btn btn-primary" 
                                            type="button"
                                            id="allBooksBtn"
                                            data-toggle="tooltip"
                                            data-placement="bottom" 
                                            title=""
                                            onClick={ this.getbookCategory.bind(this, OTbooksstart, NTbooksend) }
                                            data-original-title="All">
                                            ALL
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            id="otBooksBtn" 
                                            data-toggle="tooltip" 
                                            data-placement="bottom"
                                            title=""
                                            onClick={ this.getbookCategory.bind(this, OTbooksstart, OTbooksend) }
                                            data-original-title="Old Testament">
                                            OT
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            id="ntBooksBtn"
                                            data-toggle="tooltip"
                                            data-placement="bottom"
                                            title=""
                                            onClick={ this.getbookCategory.bind(this, NTbooksstart, NTbooksend) }
                                            data-original-title="New Testament">
                                            NT
                                        </button>
                                    </div>          
                                </div>
                                 ) : ''
                            }
                            <Tab eventKey={1} title="Book" onClick={() => this.goToTab(2)}>
                                <div className="wrap-center"></div>
                                <div className="row books-li" id="bookdata">
                                    <ul id="books-pane">
                                        {
                                            bookData.map((item,index) =>{
                                            return <li key={index}>
                                                        <a href="#" key={index} onClick={ this.onItemClick.bind(this, item) }
                                                            value={item} className={( TodoStore.bookName == item ) ? 'link-active': ""} >
                                                            {item}
                                                        </a>
                                                    </li>
                                            })
                                        }                       
                                    </ul>
                                </div>
                                <div className= "clearfix"></div>
                            </Tab>
                            <Tab eventKey={2} title="Chapters" > 
                                <div className="chapter-no">
                                    <ul id="chaptersList">
                                    { chapterList }
                                    </ul>
                                </div>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                </Modal>
                <SettingsModal show={TodoStore.showModalSettings} />
                <AboutUsModal show={TodoStore.showModalAboutUs} />
                <SearchModal show={TodoStore.showModalSearch}/>
                <DownloadModal show={TodoStore.showModalDownload} />
                <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
                    <div className="container-fluid">
                    <div className="navbar-header">
                        <button
                            className="navbar-toggle collapsed"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbar"
                            aria-expanded="false"
                            aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a href="javascript:;" className="navbar-brand" ><img alt="Brand" src="../assets/images/logo.png"/></a>
                    </div>
                    <div className="navbar-collapse collapse" id="navbar">
                        <ul className="nav navbar-nav" style={{padding: "3px 0 0 0px"}}>
                            <li>
                                <div 
                                    className="btn-group navbar-btn strong verse-diff-on"
                                    role="group"
                                    aria-label="..."
                                    id="bookBtn"
                                    style={{marginLeft:"200px"}}>
                                    <a
                                        onClick={() => this.openpopupBooks(1)}
                                        href="#"
                                        className="btn btn-default"
                                        data-toggle="tooltip"
                                        data-placement="bottom"
                                        title="Select Book"
                                        id="book-chapter-btn"
                                    >
                                    {bookName}
                                    </a>
                                    <span id="chapterBtnSpan">
                                        <a onClick={() => this.openpopupBooks(2)} className="btn btn-default" id="chapterBtn" data-target="#myModal"  data-toggle="modal" data-placement="bottom"  title="Select Chapter" >{(TodoStore.chapterId).toLocaleString(TodoStore.appLang)}
                                        </a>
                                    </span>
                                </div>                               
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right nav-pills verse-diff-on">
                            <li style={{padding: "17px 5px 0 0", color: "#fff", fontWeight: "bold"}}><span><FormattedMessage id="btn-switch-off" /></span></li>
                            <li>

                                <FormattedMessage id="tooltip-compare-mode">
                                    {(message) =>
                                        <Toggle
                                          defaultToggled={true}
                                          style={{marginTop:"17px"}}
                                        />
                                    }
                                </FormattedMessage>                               
                            </li>
                            <li style={{padding:"17px 0 0 0", color: "#fff", fontWeight: "bold"}}><span><FormattedMessage id="btn-switch-on" /></span></li>
                            <li>
                                <FormattedMessage id="tooltip-find-and-replace">
                                {(message) =>
                                <a onClick={() => this.openpopupSearch()} href="javascript:;" data-toggle="tooltip" data-placement="bottom" title={message} id="searchText">
                                <i className="fa fa-search fa-2x"></i>
                                </a>}
                                </FormattedMessage>
                            </li>
                            <li>
                                <a href="#" className="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fa fa-cloud-download fa-2x"></i>
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <li>
                                        <a onClick={() => this.openpopupDownload()} href="javascript:;">USFM</a>
                                    </li>
                                    <li>
                                        <a onClick={(e) => this.exportPDF(e, 1)} href="javascript:;">1-Column HTML</a>
                                        <a onClick={(e) => this.exportPDF(e, 2)} href="javascript:;">2-Column HTML</a>
                                        
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <FormattedMessage id="tooltip-about" >
                                {(message) =>
                                <a onClick={() => this.openpopupAboutUs()} href="#" data-target="#aboutmodal" data-toggle="tooltip" data-placement="bottom" title={message} id="btnAbout"><i className="fa fa-info fa-2x"></i></a>}
                                </FormattedMessage>
                            </li>
                            <li>
                                <FormattedMessage id="tooltip-settings" >
                                {(message) =>
                                <a onClick={() => this.openpopupSettings()} href="javascript:;" id="btnSettings" data-target="#bannerformmodal" data-toggle="tooltip" data-placement="bottom" title={message}><i className="fa fa-cog fa-2x"></i>
                                </a>}
                                </FormattedMessage>
                            </li>
                        </ul>
                    </div>
                    </div>
                </nav>
                {
                    TodoStore.layout == 1   &&
                        <div className="parentdiv">
                            <div className="layoutx"> <Reference onClick={this.handleRefChange.bind(this, 0)} refIds={TodoStore.activeRefs[0]} id = {1} layout={1}/><ReferencePanel refContent ={refContent}  /></div>
                            <div style={{padding: "10px"}} className="layoutx"><TranslationPanel onSave={this.saveTarget} /></div>
                        </div>
                } 
                {
                    TodoStore.layout == 2 &&
                    <div className="parentdiv">
                        <div className="layout2x"><Reference onClick={this.handleRefChange.bind(this, 0)} refIds={TodoStore.activeRefs[0]} id={21} layout = {1} /><ReferencePanel refContent ={refContent} refIds={TodoStore.activeRefs[0]} /></div>

                        <div className="layout2x"><Reference onClick={this.handleRefChange.bind(this, 1)} refIds={TodoStore.activeRefs[1]} id={22} layout = {2} /><ReferencePanel refContent ={refContentOne} refIds={TodoStore.activeRefs[1]}/></div>
                        <div style={{padding: "10px"}} className="layout2x"><TranslationPanel onSave={this.saveTarget} /></div>
                    </div>
                }
                {
                    TodoStore.layout == 3 &&
                    <div className="parentdiv">
                        <div className="layout3x"><Reference onClick={this.handleRefChange.bind(this, 0)} refIds={TodoStore.activeRefs[0]} id={31} layout = {1} /><ReferencePanel refContent ={refContent} refIds={TodoStore.activeRefs[0]}/></div>

                        <div className="layout3x"><Reference onClick={this.handleRefChange.bind(this, 1)} refIds={TodoStore.activeRefs[1]} id={32} layout = {2} /><ReferencePanel refContent ={refContentOne} refIds={TodoStore.activeRefs[1]}/></div>

                        <div className="layout3x"><Reference onClick={this.handleRefChange.bind(this, 2)} refIds={TodoStore.activeRefs[2]} id={33} layout = {3} /><ReferencePanel refContent ={refContentTwo} refIds={TodoStore.activeRefs[2]}/></div>
                        <div style={{ padding: "10px"}} className="layout3x"><TranslationPanel onSave={this.saveTarget} /></div>
                    </div>
                }  
                <Footer onSave={this.saveTarget} getRef = {this.getRefContents}/>
            </div>
        )
    }
}
module.exports = Navbar;
