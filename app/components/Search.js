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

@observer
class SearchModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleFindChange = this.handleFindChange.bind(this);
    this.handleReplaceChange = this.handleReplaceChange.bind(this);
      this.state = {
        showModalSearch: this.props.show,
        checked: false,
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

    replaceContentAndSave(){
      let newContent;
      let replaceCount;
      let allChapterReplaceCount = [];
      const searchValue = TodoStore.searchValue;
      const replaceValue = TodoStore.replaceValue;
      var oldContent = TodoStore.translationContent;

      for (var i = 0; i < TodoStore.verses.length; i++) {      
        if (oldContent[i].search(new RegExp(this.searchRegExp(searchValue), 'g')) >= 0) {
          newContent = oldContent[i].replace(new RegExp(this.searchRegExp(searchValue), 'g'), replaceValue);
          oldContent[i] = newContent;
          var totalReplacedWord = newContent.match(new RegExp(this.searchRegExp(replaceValue), 'g')).length;
          allChapterReplaceCount.push(totalReplacedWord);
          replaceCount = allChapterReplaceCount.reduce((a,b) => a+b, 0);
        }
      }
      db.get(TodoStore.bookId).then((doc) => {
        var verses = doc.chapters[TodoStore.chapterId-1].verses
          verses.forEach(function(verse, index) {
              verse.verse = oldContent[index];
        });
      doc.chapters[TodoStore.chapterId-1].verses = verses;
      db.put(doc, function(err, response) {
        if (err) {
            console.log(err);
        } else {
          TodoStore.showModalSearch = false;
          swal('Replaced Information', `Book: ${Constant.booksList[parseInt(TodoStore.bookId, 10) - 1]}
                                        Total word replaced: ${replaceCount} `, 'success');
          replaceCount = 0;
          allChapterReplaceCount = [];
        }
      });
    })
  }

  render (){
    let closeSearch = () => TodoStore.showModalSearch = false
    return (  
      <Modal show={TodoStore.showModalSearch} onHide={closeSearch} id="tab-search">
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage id="label-find-replace" /></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup >
            <RadioButtonGroup onChange={this.handleFindChange.bind(this)} name="SearchAndReplace" style={{display: "flex", marginBottom:"2%"}}>
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
              value={TodoStore.searchValue}
              onChange={this.handleFindChange.bind(this)}
            />
            <br />
            <label><FormattedMessage id="label-replace-with" /></label><br />
            <TextField
              style={{marginTop: "-12px"}}
              hintText={<FormattedMessage id="placeholder-replace-text" />}
              value={TodoStore.replaceValue}
              onChange={this.handleReplaceChange.bind(this)}
            />
            <br />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <RaisedButton
            style={{float: "right"}}
            label={<FormattedMessage id="btn-save-changes" />}
            primary={true}
            onClick={this.replaceContentAndSave.bind(this)}
          />
        </Modal.Footer>
      </Modal>
    )
  }
}

module.exports = SearchModal
