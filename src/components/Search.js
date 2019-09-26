import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import { observer } from "mobx-react"
import AutographaStore from "./AutographaStore";
import { FormattedMessage } from 'react-intl';
const Modal = require('react-bootstrap/lib/Modal');
const FormGroup = require('react-bootstrap/lib/FormGroup')
const db = require(`${__dirname}/../util/data-provider`).targetDb();
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
      AutographaStore.searchValue = event.target.value
    }

    handleReplaceChange(event) {
      AutographaStore.replaceValue = event.target.value
    }
    handleOption = (event) => {
      AutographaStore.replaceOption = event.target.value
    } 

    findAndReplaceText = (searchVal, replaceVal, option) => {
      let that = this;
      let allChapterReplaceCount = [];

      db.get(AutographaStore.bookId.toString()).then((doc) => {
          
              let currentBook = doc;
              let totalReplacedWord = 0;
              if (option == "chapter") {
                  totalReplacedWord = that.findReplaceSearchInputs(doc.chapters[parseInt(AutographaStore.chapterId, 10) - 1].verses, AutographaStore.chapterId - 1, searchVal, replaceVal, option);
                  allChapterReplaceCount.push(totalReplacedWord);
              } else {
                  for (let i = 0; i < doc.chapters.length; i++) {
                      let replaceWord = that.findReplaceSearchInputs(doc.chapters[parseInt(i + 1, 10) - 1].verses, i, searchVal, replaceVal, option);
                      allChapterReplaceCount.push(replaceWord)
                      replaceWord = 0;
                  }                  
              }
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
      let i;
      let that = this;
      let replaceCount = 0;
      for (i = 1; i <= verses.length; i++) {
          if (option === "chapter") {
              let originalVerse = verses[i - 1].verse;
              replacedVerse[i] = i
              if (originalVerse.search(new RegExp(that.searchRegExp(searchVal), 'g')) >= 0) {
                  let modifiedVerse = originalVerse.replace(new RegExp(that.searchRegExp(searchVal), 'g'), replaceVal);
                  replacedVerse[i] = modifiedVerse;
                  chapter_hash["verse"] = modifiedVerse;
                  chapter_hash["verse_number"] = i;
                  verses_arr.push(chapter_hash);
                  chapter_hash = {};
                  replaceCount += originalVerse.match(new RegExp(that.searchRegExp(searchVal), 'g')).length;
              } else {
                  replacedVerse[i] = originalVerse;
                  chapter_hash["verse"] = originalVerse;
                  chapter_hash["verse_number"] = i;
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
                  chapter_hash["verse_number"] = i;
                  verses_arr.push(chapter_hash);
                  chapter_hash = {};
                  replaceCount += originalVerse.match(new RegExp(searchVal, 'g')).length;

              } else {
                  chapter_hash["verse"] = originalVerse;
                  chapter_hash["verse_number"] = i;
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
      return replaceCount;
    }

    saveReplacedText = () => {
    const that = this;
    db.get(AutographaStore.bookId.toString()).then((doc) => {
        if (AutographaStore.replaceOption === "chapter") {
            for (var c in replacedChapter) {
                var verses = doc.chapters[AutographaStore.chapterId-1].verses
                verses.forEach((verse, index)=> {
                    verse.verse = replacedChapter[c][index + 1];
                });
                doc.chapters[parseInt(c, 10)].verses = verses;
                db.put(doc, function(err, response) {
                    if (err) {
                        // $("#replaced-text-change").modal('toggle');
                        // alertModal("dynamic-msg-error", "dynamic-msg-went-wrong");
                    } else {
                        that.loadData()
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
                    that.loadData()
                }
            })
        }
    })
  }

  loadData = () => {
    this.props.loadData()
    this.setState({replaceInfo: false})
    AutographaStore.replaceOption = "chapter";
  }

    replaceContentAndSave(){
      let newContent;
      let replaceCount;
      let allChapterReplaceCount = [];
      const searchValue = AutographaStore.searchValue;
      const replaceValue = AutographaStore.replaceValue;
      let oldContent = AutographaStore.translationContent;

      this.findAndReplaceText(AutographaStore.searchValue, AutographaStore.replaceValue, AutographaStore.replaceOption);
      AutographaStore.showModalSearch = false;
    }


  render (){
    let closeSearch = () => {
      AutographaStore.showModalSearch = false;
      AutographaStore.replaceOption = "chapter";
    }
    let closeReplaceModal = () => {
      this.setState({replaceInfo: false})
      AutographaStore.replaceOption = "chapter";
    }
    let wordBook = AutographaStore.currentTrans["dynamic-msg-book"];
    let wordReplace = AutographaStore.currentTrans["label-total-word-replaced"]
    return (  
      <div>
      <Modal show={AutographaStore.showModalSearch} onHide={closeSearch} id="tab-search">
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage id="label-find-replace" /></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup >
            <RadioButtonGroup valueSelected= {AutographaStore.replaceOption} onChange={this.handleOption} name="SearchAndReplace" style={{display: "flex", marginBottom:"2%"}}>
              <RadioButton
                value="chapter"
                label={<FormattedMessage id="label-current-chapter" />}
                style={{width: "40%"}}
              />
              <RadioButton
                value="book"
                className="book"
                label={<FormattedMessage id="label-current-book" />}
                style={{width: "40%"}}
              />
            </RadioButtonGroup>
          </FormGroup>
          <div>
            <label><FormattedMessage id="label-find" /></label><br />
            <TextField
              className="placeholder-search-text"
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
            className="btn-replace"
            label={<FormattedMessage id="btn-replace" />}
            primary={true}
            onClick={this.replaceContentAndSave.bind(this)}
            disabled = {AutographaStore.searchValue === null || AutographaStore.searchValue === '' ? true : false}
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
                  {this.state.replaceCount} {AutographaStore.currentTrans["label-occurrences-replaced"]}
              </div>
              </div>
          <div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <RaisedButton
            style={{marginRight: "10px"}}
            className="btn-save-changes"
            label={<FormattedMessage id="btn-save-changes" />}
            primary={true}
            onClick={this.saveReplacedText}
          />
          <RaisedButton
            label={<FormattedMessage id="btn-cancel" />}
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
