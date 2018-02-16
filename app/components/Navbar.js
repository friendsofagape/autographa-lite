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
import Reference from "./Reference"
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
        session.defaultSession.cookies.get({ url: 'http://refs.autographa.com' }, (error, refCookie) => {
            if(refCookie.length > 0){
                TodoStore.refId = refCookie[0].value;
            }
        });
        session.defaultSession.cookies.get({ url: 'http://book.autographa.com' }, (error, bookCookie) => {
            if(bookCookie.length > 0){
                TodoStore.bookId = bookCookie[0].value;
                session.defaultSession.cookies.get({ url: 'http://chapter.autographa.com' }, (error, chapterCookie) => {
                    if(chapterCookie[0].value){
                        TodoStore.chapterId = chapterCookie[0].value;
                        db.get(TodoStore.bookId).then(function(doc) {
                            refDb.get('refChunks').then(function(chunkDoc) {
                                TodoStore.verses = doc.chapters[parseInt(TodoStore.chapterId, 10) - 1].verses;
                                TodoStore.chunks = chunkDoc.chunks[parseInt(TodoStore.bookId, 10) - 1];
                                chapter = TodoStore.chapterId
                                that.getRefContents(TodoStore.refId+'_'+Constant.bookCodeList[parseInt(TodoStore.bookId, 10) - 1],chapter.toString());
                            })
                        })
                    }
                });
            }
            else{
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
                        that.getRefContents(TodoStore.refId+'_'+Constant.bookCodeList[parseInt(TodoStore.bookId, 10) - 1],chapter.toString());
                    })
                })
                    var cookie = { url: 'http://book.autographa.com', name: 'book', value: book.toString() };
                    session.defaultSession.cookies.set(cookie, (error) => {
                        if (error)
                            console.error(error);
                        var cookie = { url: 'http://chapter.autographa.com', name: 'chapter', value: chapter.toString() };
                        session.defaultSession.cookies.set(cookie, (error) => {
                            if (error)
                                console.error(error);
                        });
                    });
                }).catch(function(err) {
                    console.log('Error: While retrieving document. ' + err);
                });
            }
        });        
    }

    getRefContents(id,chapter) {

        let refContent = refDb.get(id).then(function(doc) { //book code is hard coded for now
            for (var i = 0; i < doc.chapters.length; i++) {
                if (doc.chapters[i].chapter == parseInt(chapter, 10)) { // 1 is chapter number and hardcoded for now
                    break;
                    }
            }
            let refString = doc.chapters[i].verses.map(function(verse, verseNum) {
                return '<div data-verse="r' + (verseNum + 1) + '"><span class="verse-num">' + (verseNum + 1) + '</span><span>' + verse.verse + '</span></div>';
            }).join('');
            return refString;
        }).catch(function(err) {
            console.log(err)
        });

        // console.log(TodoStore.aId)
        if(TodoStore.aid ==1 || TodoStore.aId  == 2 && TodoStore.layout === 2) {

            console.log("TodoStore.selectId")
             refContent.then((content)=> {
                console.log("content called")
                TodoStore.content = content;
                // TodoStore.contentOne = content;

            });
              refContent.then((content)=> {
                // console.log("contentOne called")
                TodoStore.contentOne = content;
            });
        }

        else if(TodoStore.aId  == 1 || TodoStore.aId  == 2 && TodoStore.layout === 3) {

            // console.log("TodoStore.selectId")
             refContent.then((content)=> {
                // console.log("content called")
                TodoStore.content = content;
                // TodoStore.contentOne = content;

            });
              refContent.then((content)=> {
                // console.log("contentOne called")
                TodoStore.contentOne = content;
            });
              refContent.then((content)=> {
             TodoStore.contentTwo = content;
         });
        }
       else if(TodoStore.layoutContent === 1 ) {
            refContent.then((content)=> {
                // console.log("content called")
                TodoStore.content = content;

            });
        }

        else if(TodoStore.layoutContent === 2 ) {
             // console.log("selectId")
            refContent.then((content)=> {
                console.log("contentOne called")
                TodoStore.contentOne = content;
            });
            
        }

        else if(TodoStore.layoutContent === 3 ) {
            refContent.then((content)=> {
             TodoStore.contentTwo = content;
             if(TodoStore.layout3xDirect == true) {
                TodoStore.contentOne = content;
                TodoStore.layout3xDirect = false;
             }
            });
        }
        TodoStore.aId  = "";
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

    exportPDF = (e) => { 
        session.defaultSession.cookies.get({ url: 'http://book.autographa.com' }, (error, cookie) => {
            if (error) {
                swal("Error", "Please enter Translation Details in the Settings to continue with Export.", "error");
            }
            var bookNo = TodoStore.bookId.toString();
            db.get(bookNo).then((doc) => {
                book = cookie[0].value;
                currentBook = doc;
                let id = TodoStore.currentRef + '_' + Constant.bookCodeList[parseInt(book, 10) - 1];
                exportHtml.exportHtml(id, currentBook, db, doc.langScript);
            }); 
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
        console.log(bookName)
        console.log(Constant.booksList)
                for (var i = 0; i < Constant.booksList.length; i++) {
            bookName == Constant.booksList[i]
            console.log(bookName == Constant.booksList[i])
            if (bookName == Constant.booksList[i]) {
                 // console.log(i)
                var bookNo = i+1;
                 console.log(bookNo)
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
        this.setState({key});
    }

    goToTab(key) {
        var _this = this;
        TodoStore.activeTab = key;
    }

    getValue(chapter, bookId){
        TodoStore.translationContent = "";
         // console.log("get value called")
        TodoStore.chapterId = chapter;
        //TodoStore.aId = event.target.id;
        //console.log(event.target.id);
         // console.log(chapter)
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
                    console.log("if called")
                    // console.log(chapter);
                    that.getRefContents(TodoStore.refId+'_'+Constant.bookCodeList[parseInt(TodoStore.bookId, 10) - 1],chapter.toString());
                    // that.getRefContents(TodoStore.refId1+'_'+Constant.bookCodeList[parseInt(TodoStore.bookId, 10) - 1],chapter.toString(),verses);
                    
                });
            })
            }else{
                var that = this; 
                var bkId = TodoStore.bookId.toString();  
                var chapter;
                console.log("else called")
                TodoStore.bookName = Constant.booksList[parseInt(TodoStore.bookId, 10) - 1] 
                db.get(bkId).then(function(doc) {
                    console.log("else called")
                    refDb.get('refChunks').then(function(chunkDoc) {
                    TodoStore.verses = doc.chapters[parseInt(TodoStore.chapterId, 10) - 1].verses;
                    TodoStore.chunks = chunkDoc.chunks[parseInt(TodoStore.bookId, 10) - 1];
                    chapter = TodoStore.chapterId;
                    that.getRefContents('eng_ulb'+'_'+Constant.bookCodeList[parseInt(TodoStore.bookId, 10) - 1],chapter.toString());
                    //that.createVerseInputs(verses, chunks, chapter);
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

    saveTarget() {
        var bookNo = TodoStore.bookId.toString();
        db.get(bookNo).then(function(doc) {
            console.log(doc);
            refDb.get('refChunks').then(function(chunkDoc) {
                var verses = doc.chapters[parseInt(TodoStore.chapterId, 10) - 1].verses;
                console.log(verses);
                verses.forEach(function(verse, index) {
                    var vId = 'v' + (index + 1);
                    verse.verse = document.getElementById(vId).textContent;
                    doc.chapters[parseInt(TodoStore.chapterId, 10) - 1].verses = verses;
                    db.get(doc._id).then(function(book) {
                        doc._rev = book._rev;
                        db.put(doc).then(function(response) {
                            var dateTime = new Date();
                            var finalTime = dateTime.toLocaleTimeString();
                            $("#saved-time").html("Changes last saved on " + finalTime);
                            setAutoSaveTime(formatDate(dateTime));
                            clearInterval("#saved-time");
                        }).catch(function(err) {
                            db.put(doc).then(function(response) {
                            var dateTime = new Date();
                            var finalTime = dateTime.toLocaleTimeString();
                            $("#saved-time").html("Changes last saved on " + finalTime);
                                setAutoSaveTime(formatDate(dateTime));
                            }).catch(function(err) {
                                clearInterval("#saved-time");
                            });
                            clearInterval("#saved-time");
                            // clearInterval(intervalId);
                        });
                    });
                });
            });
        }).catch(function(err) {
            console.log('Error: While retrieving document. ' + err);
        });
    }

    handleRefChange(event) {
        event.persist();

         TodoStore.selectId = event.target.id;
         TodoStore.layoutContent = parseInt(event.currentTarget.dataset.layout);
         let referenceValue = event.target.value;
         TodoStore.currentRef = referenceValue;
         switch(TodoStore.layoutContent){
            case 1:
                TodoStore.refId = event.target.value;
                break;
            case 2:
                TodoStore.refId1 = event.target.value;
                break;
            case 3:
                TodoStore.refId2 = event.target.value;
                break;
         }

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
        const layout = TodoStore.layout;
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
        let close = () => TodoStore.showModalBooks = false;//this.setState({ showModal: false, showModalSettings: false, showModalBooks: false });
        const test = (TodoStore.activeTab == 1);
        var chapterList = [];
        for(var i=0; i<TodoStore.bookChapter["chapterLength"]; i++){
        chapterList.push( <li key={i} value={i+1} ><a href="#"  className={(i+1 == TodoStore.chapterActive) ? 'link-active': ""} onClick = { this.getValue.bind(this,  i+1, TodoStore.bookChapter["bookId"]) } >{i+1}</a></li> );
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
                                    <a onClick={() => this.openpopupBooks(1)} href="#" className="btn btn-default" data-toggle="tooltip"data-placement="bottom" title="Select Book"  id="book-chapter-btn">{bookName}
                                    </a>
                                    <span id="chapterBtnSpan">
                                        <a onClick={() => this.openpopupBooks(2)} className="btn btn-default" id="chapterBtn" data-target="#myModal"  data-toggle="modal" data-placement="bottom"  title="Select Chapter" >{TodoStore.chapterId}
                                        </a>
                                    </span>
                                </div>                               
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right nav-pills verse-diff-on">
                            <li style={{padding: "17px 5px 0 0", color: "#fff", fontWeight: "bold"}}><span>OFF</span></li>
                            <li>
                                <label style={{marginTop:"17px"}} className="mdl-switch mdl-js-switch mdl-js-ripple-effect" htmlFor="switch-2" id="switchLable" data-toggle='tooltip' data-placement='bottom' title="Compare mode">
                                    <input type="checkbox" id="switch-2" className="mdl-switch__input check-diff"/>
                                    <span className="mdl-switch__label"></span>
                                </label>                               
                            </li>
                            <li style={{padding:"17px 0 0 0", color: "#fff", fontWeight: "bold"}}><span>ON</span></li>
                            <li>
                                <a onClick={() => this.openpopupSearch()} href="javascript:;" data-toggle="tooltip" data-placement="bottom" title="Find and replace" id="searchText"><i className="fa fa-search fa-2x"></i></a>
                            </li>
                            <li>
                                <a href="#" className="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fa fa-cloud-download fa-2x"></i>
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <li>
                                        <a onClick={() => this.openpopupDownload()} href="javascript:;" id="export-usfm">USFM</a>
                                    </li>
                                    <li>
                                        <a onClick={(e) => this.exportPDF(e)} href="javascript:;" id="print-pdf">HTML</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a onClick={() => this.openpopupAboutUs()} href="#" data-target="#aboutmodal" data-toggle="tooltip" data-placement="bottom" title="About" id="btnAbout"><i className="fa fa-info fa-2x"></i></a>
                            </li>
                            <li>
                                <a onClick={() => this.openpopupSettings()} href="javascript:;" id="btnSettings" data-target="#bannerformmodal" data-toggle="tooltip" data-placement="bottom" title="Settings"><i className="fa fa-cog fa-2x"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                    </div>
                </nav>
                {layout == 1   &&
                <div className="parentdiv">
                <div className="parentdiv">
                <div className="layoutx"> <Reference onClick={this.handleRefChange} refIds={TodoStore.refId} id = {1} layout={1}/><TranslationPanel refContent ={refContent}  /></div>
                <div style={{padding: "10px"}} className="layoutx"><ReferencePanel /></div>                    
                </div>
                </div>
                } 
                {layout == 2 &&
                <div className="parentdiv">
                <div className="parentdiv">

                <div className="layout2x"><Reference onClick={this.handleRefChange} refIds={TodoStore.refId} id={21} layout = {1} /><TranslationPanel refContent ={refContent}  /></div>

                <div className="layout2x"><Reference onClick={this.handleRefChange} refIds={TodoStore.refId1} id={22} layout = {2} /><TranslationPanel refContent ={refContentOne}/></div>
                <div style={{padding: "10px"}} className="layout2x"><ReferencePanel /></div>
                </div>
                </div>
                }
                {layout == 3 &&
                <div className="parentdiv">
                <div className="parentdiv">

                <div className="layout3x"><Reference onClick={this.handleRefChange} refIds={TodoStore.refId} id={31} layout = {1} /><TranslationPanel refContent ={refContent}/></div>

                <div className="layout3x"><Reference onClick={this.handleRefChange} refIds={TodoStore.refId1} id={32} layout = {2} /><TranslationPanel refContent ={refContentOne}/></div>

                <div className="layout3x"><Reference onClick={this.handleRefChange} refIds={TodoStore.refId2} id={33} layout = {3} /><TranslationPanel refContent ={refContentTwo}/></div>
                <div style={{ padding: "10px"}} className="layout3x"><ReferencePanel /></div>                    
                </div>
                </div>
                }  
                <Footer onSave={this.saveTarget} getRef = {this.getRefContents}/>
            </div>
        )
    }
}
module.exports = Navbar;
