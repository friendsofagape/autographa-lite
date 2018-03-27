import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
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
const ControlLabel = require('react-bootstrap/lib/ControlLabel')
const Grid = require('react-bootstrap/lib/Grid')
const Radio = require('react-bootstrap/lib/Radio')
import RaisedButton from 'material-ui/RaisedButton';
const FormGroup = require('react-bootstrap/lib/FormGroup')
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';
import { observer } from "mobx-react"
import TodoStore from "./TodoStore";
const db = require(`${__dirname}/../util/data-provider`).targetDb();
import { FormattedMessage } from 'react-intl';
     var replacedChapter = {},
    replacedVerse = {},
     allChapters = {},
     chapter_hash = {},
     verses_arr = [],
     chapter_arr = [];
@observer
class SearchModal extends React.Component {
        
    
  constructor(props) {
    super(props);
    this.handleFindChange = this.handleFindChange.bind(this);
    this.handleReplaceChange = this.handleReplaceChange.bind(this);
      this.state = {
        showModalSearch: this.props.show,
        checked: false,
        replaceInfo: false,
        replaceCount: 0,
      };
    }

    searchRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    handleFindChange(event) {
      TodoStore.searchValue = event.target.value
    }

    handleReplaceChange(event) {
      TodoStore.replaceValue = event.target.value
    }
    handleOption = (event) => {
      TodoStore.replaceOption = event.target.value
    } 

    findAndReplaceText = (searchVal, replaceVal, option) => {
      let that = this;
      let allChapterReplaceCount = [];

      db.get(TodoStore.bookId).then((doc) => {
          
              let currentBook = doc;
              let totalReplacedWord = 0;
              if (option == "chapter") {
                  totalReplacedWord = that.findReplaceSearchInputs(doc.chapters[parseInt(TodoStore.chapterId, 10) - 1].verses, TodoStore.chapterId - 1, searchVal, replaceVal, option);
                  allChapterReplaceCount.push(totalReplacedWord);
              } else {
                  for (let i = 0; i < doc.chapters.length; i++) {
                      let replaceWord = that.findReplaceSearchInputs(doc.chapters[parseInt(i + 1, 10) - 1].verses, i, searchVal, replaceVal, option);
                      console.log(replaceWord)
                      allChapterReplaceCount.push(replaceWord)
                      console.log(totalReplacedWord)
                      replaceWord = 0;
                  }                  
              }
              console.log(allChapterReplaceCount)
              var replacedCount = allChapterReplaceCount.reduce(function(a, b) {
                    return a + b;
              }, 0);
              this.setState({replaceCount: replacedCount, replaceInfo: true })
              totalReplacedWord = 0;
              allChapterReplaceCount = [];
          });
        
    }

    findReplaceSearchInputs = (verses, chapter, searchVal, replaceVal, option) => {
      let replacedVerse = {};
      var i;
      let that = this;
      let replaceCount = 0;
      for (i = 1; i <= verses.length; i++) {
          if (option == "chapter") {
              let originalVerse = verses[i - 1].verse;
              console.log(searchVal)
              replacedVerse[i] = i;
              if (originalVerse.search(new RegExp(that.searchRegExp(searchVal), 'g')) >= 0) {
                  let modifiedVerse = originalVerse.replace(new RegExp(that.searchRegExp(searchVal), 'g'), replaceVal);
                  replacedVerse[i] = modifiedVerse;
                  chapter_hash["verse"] = modifiedVerse;
                  chapter_hash["verse_number"] = i + 1;
                  verses_arr.push(chapter_hash);
                  chapter_hash = {};
                  replaceCount += originalVerse.match(new RegExp(that.searchRegExp(searchVal), 'g')).length;
              } else {
                  replacedVerse[i] = originalVerse;
                  chapter_hash["verse"] = originalVerse;
                  chapter_hash["verse_number"] = i + 1;
                  verses_arr.push(chapter_hash);
                  chapter_hash = {};
                  replaceCount += 0;
              }
          } else {
              let originalVerse = verses[i - 1].verse
              replacedVerse[i] = i;
              if (originalVerse.search(new RegExp(that.searchRegExp(searchVal), 'g')) >= 0) {
                  let modifiedVerse = originalVerse.replace(new RegExp(that.searchRegExp(searchVal), 'g'), replaceVal);
                  chapter_hash["verse"] = modifiedVerse;
                  chapter_hash["verse_number"] = i + 1;
                  verses_arr.push(chapter_hash);
                  chapter_hash = {};
                  replaceCount += originalVerse.match(new RegExp(searchVal, 'g')).length;

              } else {
                  chapter_hash["verse"] = originalVerse;
                  chapter_hash["verse_number"] = i + 1;
                  verses_arr.push(chapter_hash);
                  chapter_hash = {};
                  replaceCount += 0;
              }
          }
      }
      replacedChapter[chapter] = replacedVerse;
      allChapters["chapter"] = chapter + 1;
      allChapters["verses"] = verses_arr;
      chapter_arr.push(allChapters);
      verses_arr = [];
      allChapters = {};
      // highlightRef();
      console.log(replaceCount)
      return replaceCount;
    }

    saveReplacedText = () => {
    db.get(TodoStore.bookId).then((doc) => {
        if (TodoStore.replaceOption == "chapter") {
            for (var c in replacedChapter) {
                var verses = doc.chapters[TodoStore.chapterId-1].verses
                verses.forEach((verse, index)=> {
                    verse.verse = replacedChapter[c][index + 1];
                });
                doc.chapters[parseInt(c, 10)].verses = verses;
                db.put(doc, function(err, response) {
                    if (err) {
                        // $("#replaced-text-change").modal('toggle');
                        // alertModal("dynamic-msg-error", "dynamic-msg-went-wrong");
                    } else {
                        window.location.reload();
                    }
                });
            }
            replacedChapter = {};
            replacedVerse = {};
        } else {
            doc.chapters = chapter_arr
            db.put(doc, function(err, res) {
                if (err) {
                    chapter_arr = [];
                    // $("#replaced-text-change").modal('toggle');
                    // alertModal("dynamic-msg-error", "dynamic-msg-went-wrong");
                } else {
                    chapter_arr = [];
                    replacedChapter = {};
                    replacedVerse = {};
                    window.location.reload();
                }
            })
        }
    })
  }

  
    replaceContentAndSave(){
      let newContent;
      let replaceCount;
      let allChapterReplaceCount = [];
      const searchValue = TodoStore.searchValue;
      const replaceValue = TodoStore.replaceValue;
      let oldContent = TodoStore.translationContent;

      this.findAndReplaceText(TodoStore.searchValue, TodoStore.replaceValue, TodoStore.replaceOption);
      // for (var i = 0; i < TodoStore.verses.length; i++) {      
      //   if (oldContent[i].search(new RegExp(this.searchRegExp(searchValue), 'g')) >= 0) {
      //     newContent = oldContent[i].replace(new RegExp(this.searchRegExp(searchValue), 'g'), replaceValue);
      //     oldContent[i] = newContent;
      //     var totalReplacedWord = newContent.match(new RegExp(this.searchRegExp(replaceValue), 'g')).length;
      //     allChapterReplaceCount.push(totalReplacedWord);
      //     replaceCount = allChapterReplaceCount.reduce((a,b) => a+b, 0);
      //     this.setState({replaceCount: replaceCount})
      //   }
      // }
      // this.setState({replaceInfo: true});
      TodoStore.showModalSearch = false;

      // db.get(TodoStore.bookId).then((doc) => {
      //     var verses = doc.chapters[TodoStore.chapterId-1].verses
      //     verses.forEach(function(verse, index) {
      //         verse.verse = oldContent[index];
      //     });
      //     doc.chapters[TodoStore.chapterId-1].verses = verses;
      //     db.put(doc, function(err, response) {
      //       if (err) {
      //           console.log(err);
      //       } else {
      //         TodoStore.showModalSearch = false;
      //         swal('Replaced Information', `Book: ${Constant.booksList[parseInt(TodoStore.bookId, 10) - 1]}
      //                                       Total word replaced: ${replaceCount} `, 'success');
      //         replaceCount = 0;
      //         allChapterReplaceCount = [];
      //       }
      //     });
      // })
    }


  render (){
    let closeSearch = () => TodoStore.showModalSearch = false
    let closeReplaceModal = () => this.setState({replaceInfo: false})
    return (  
      <div>
      <Modal show={TodoStore.showModalSearch} onHide={closeSearch} id="tab-search">
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage id="label-find-replace" /></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup >
            <RadioButtonGroup valueSelected="chapter" onChange={this.handleOption} name="SearchAndReplace" style={{display: "flex", marginBottom:"2%"}}>
              <RadioButton
                value="chapter"
                label={<FormattedMessage id="label-current-chapter" />}
                style={{width: "40%"}}
              />
              <RadioButton
                value="book"
                label={<FormattedMessage id="label-current-book" />}
                style={{width: "40%"}}
              />
            </RadioButtonGroup>
          </FormGroup>
          <div>
            <label><FormattedMessage id="label-find" /></label><br />
            <TextField
              style={{marginTop: "-12px"}}
              hintText={<FormattedMessage id="placeholder-search-text" />}
              onChange={this.handleFindChange.bind(this)}
            />
            <br />
            <label><FormattedMessage id="label-replace-with" /></label><br />
            <TextField
              style={{marginTop: "-12px"}}
              hintText={<FormattedMessage id="placeholder-replace-text" />}
              onChange={this.handleReplaceChange.bind(this)}
            />
            <br />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <RaisedButton
            style={{float: "right"}}
            label={<FormattedMessage id="btn-replace" />}
            primary={true}
            onClick={this.replaceContentAndSave.bind(this)}
          />
        </Modal.Footer>
      </Modal>

      <Modal show={this.state.replaceInfo} onHide={closeReplaceModal} id="replace-modal">
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage id="label-replaced-information" /></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
              <div className="col-lg-6" id="replace-message">
                {
                  `Book: ${Constant.booksList[parseInt(TodoStore.bookId, 10) - 1]}
                    Total word replaced: ${this.state.replaceCount}`
                }
              </div>
              </div>
          <div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <RaisedButton
            style={{marginRight: "10px"}}
            label={<FormattedMessage id="btn-save-changes" />}
            primary={true}
            onClick={this.saveReplacedText}
          />
          <RaisedButton
            label={<FormattedMessage id="btn-replace-cancel" />}
            primary={true}
            onClick={closeReplaceModal}
          />
        </Modal.Footer>
      </Modal>
      </div>
    )
  }
}

module.exports = SearchModal
