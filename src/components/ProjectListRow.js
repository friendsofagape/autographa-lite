import React, { PropTypes } from 'react';
import swal from 'sweetalert';
import AutographaStore from "./AutographaStore";
import BookList from './BookList';
import { Panel, FormGroup, Checkbox, Button } from 'react-bootstrap/lib';
import axios from 'axios';
import xml2js from 'xml2js';
const electron = require('electron').remote;
const currentWindow = electron.getCurrentWindow();
const db = currentWindow.targetDb;
const booksCodes = require(`${__dirname}/../util/constants.js`).bookCodeList;

var convert = require('xml-js');

class ProjectListRow extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			bookList: [],
			selectedBook: [],
			importText: "Import",
			isImporting: false
		}
	}
	componentDidMount() {
		let config = {headers: {
            Authorization: `Bearer ${AutographaStore.tempAccessToken}`
        }}
        let books = [];
        axios.get(`https://data-access.paratext.org/api8/books/${this.props.project.projid[0]}`, config).then((res) => {
            let parser = new xml2js.Parser();
            parser.parseString(res.data, (err, result) => {
            	books = result.ProjectBooks.Book.map((res, i) => {
            		return res.$
            	});
            	this.setState({
         			bookList: books
        		});
            });
        });
	}
	selectBook = (projId, bookId, obj) => {
		// console.log(projId, bookId, obj.target.checked)
		if(obj.target.checked) {
			this.state.selectedBook.push(bookId)
			AutographaStore.selectedParaTextBook[projId] = this.state.selectedBook
		}else{
			this.state.selectedBook = this.state.selectedBook.filter(id => id !== bookId )
			AutographaStore.selectedParaTextBook[projId] = this.state.selectedBook
		}
	}
	
  	importBook = (projectId) => {
  		if(AutographaStore.selectedParaTextBook[projectId] == null || Object.keys(AutographaStore.selectedParaTextBook[projectId]).length == 0){
        	swal("Book", "Please select book to import", "success");
  			return
  		}
	    const currentTrans = AutographaStore.currentTrans;
	    let config = {headers: {
            Authorization: `Bearer ${AutographaStore.tempAccessToken}`
        }}
	    swal({
	        title: "Warning",
	        text: "This will overwrite any existing text in the selected books",
	        icon: "warning",
	        buttons: [currentTrans["btn-ok"], currentTrans["btn-cancel"]],
	        dangerMode: false,
	        closeOnClickOutside: false,
	        closeOnEsc: false
	      })
	      .then((action) => {
	        if (action) {
	        } else {
	        	this.setState({importText: "Importing...", isImporting: true})
	        	AutographaStore.selectedParaTextBook[projectId].map((bookId) => {
 	        		axios.get(`https://data-access.paratext.org/api8/text/${projectId}/${bookId}`, config).then((res) => {
		            
		            let book = {};
                	let verse = [];
                	let chapters = [];
		            let parser = new DOMParser();
					let xmlDoc = parser.parseFromString(res.data,"text/xml");
					let childNodes = xmlDoc.getElementsByTagName('usx')[0].childNodes;
					let chapter = ""
										
					for(let i = 0; i < childNodes.length; i++) {
						var item = childNodes.item(i);
						let nodeName = item.nodeName;
						let tempVerse = "";
						if(nodeName === "chapter"){
							verse = [];
			                chapter = item.attributes["number"].value;
			            }
			            if(nodeName === "verse") {
			            	tempVerse = item.attributes["number"].value;
			            	verse.push({verse_number: tempVerse, verse: item.nextSibling !== null ? (item.nextSibling.data !== undefined ? item.nextSibling.data : "")   : ""})
			            }
			            if(chapter !== ""){
			            	book[chapter] = verse;
			        	}						
					}
					let bookCode = 0;
					for ( bookCode = 0; bookCode < booksCodes.length; bookCode++) {
	                    if (bookId === booksCodes[bookCode]) {
	                        bookCode++;
	                        break;
	                    }
                	}
					db.get(bookCode.toString()).then((doc) => {
	                    for (let i = 0; i < doc.chapters.length; i++) {
	                        for (let j = 1; j <= Object.keys(book).length; j++) {
	                            if (j === doc.chapters[i].chapter) {
	                                var versesLen = Math.min(book[j].length, doc.chapters[i].verses.length);
	                                for (let k = 0; k < versesLen; k++) {
	                                    var verseNum = book[j][k].verse_number;
	                                    console.log(book[j][k].verse)
	                                    doc.chapters[i].verses[verseNum - 1].verse = book[j][k].verse;
	                                    book[j][k] = undefined;
	                                }
	                                //check for extra verses in the imported usfm here.
	                                break;
	                            }
	                        }
	                    }
	                    db.put(doc).then((response) => {
	                    	console.log(response)
	        				this.setState({importText: "Import", isImporting: false})
	                    }, (err) => {
	                    	console.log(err)
	        				this.setState({importText: "Import", isImporting: false})
	                        // return callback('Error: While trying to save to DB. ' + err);
	                    });	
                	});
					// console.log(book)
		        	});
 	        	})
	        }
	    });
  	}
  	uploadBook = (projectId) => {
  		let config = {headers: {
            Authorization: `Bearer ${AutographaStore.tempAccessToken}`
        }}
        if(AutographaStore.selectedParaTextBook[projectId] == null || Object.keys(AutographaStore.selectedParaTextBook[projectId]).length == 0){
        	swal("Book", "Please select book to import", "success");
  			return
  		}
  		AutographaStore.selectedParaTextBook[projectId].map((bookId) => {
  			axios.get(`https://data-access.paratext.org/api8/revisions/${projectId}/${bookId}`, config).then((res) => {
  				let parser = new xml2js.Parser();
	            parser.parseString(res.data, (err, result) => {
	            	console.log(result.RevisionInfo.ChapterInfo[0].$.revision)
	            	
	            });
  			})
  		})
  	}
  	render (){
  		const {project, index} = this.props;
	  		return (
	  			<Panel eventKey={index}>
				    <Panel.Heading>
				      <Panel.Title toggle>{ project.proj[0] }</Panel.Title>
				    </Panel.Heading>
				    <Panel.Body collapsible>
				    	<FormGroup>
						    {
						    	this.state.bookList.map((res, i) => {
						    		return(<Checkbox inline key={i} value={res.id} onChange={(e) => {this.selectBook(project.projid[0], res.id, e)}}>{res.id}</Checkbox>)
						    	})
						    }
				    	</FormGroup>
				    	<Button type="button" onClick={() =>{ this.importBook(project.projid[0])} } disabled={this.state.isImporting ? true : false}>{this.state.importText}</Button>
				    	<Button type="button" onClick={() =>{ this.uploadBook(project.projid[0])} } disabled={this.state.isImporting ? true : false}>Upload</Button>
				    </Panel.Body>
				</Panel>
			);
	};
}
ProjectListRow.propTypes = {
  project: PropTypes.object.isRequired
};
export default ProjectListRow;