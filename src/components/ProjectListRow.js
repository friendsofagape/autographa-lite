import React, { PropTypes } from 'react';
import swal from 'sweetalert';
import AutographaStore from "./AutographaStore";
import BookList from './BookList';
import { Panel,  FormGroup, Checkbox, Button } from 'react-bootstrap/lib';
import axios from 'axios';
import xml2js from 'xml2js';
const db = require(`${__dirname}/../util/data-provider`).targetDb();
const booksCodes = require(`${__dirname}/../util/constants.js`).bookCodeList;
const { app } = require('electron').remote;
const fs = require('fs');
const path = require('path');
const dir = path.join(app.getPath('userData'), 'paratext_book');


class ProjectListRow extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			bookList: [],
			selectedBook: [],
			importText: AutographaStore.currentTrans["btn-import"],
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
	resetLoader = () => {
		this.props.showLoader(false);						
	    this.setState({importText: AutographaStore.currentTrans["btn-import"], isImporting: false})
	}
  	importBook = (projectId) => {
		this.props.setToken(AutographaStore.userName, AutographaStore.password).then((res)=>{
			if (!res){
				swal(AutographaStore.currentTrans["dynamic-msg-error"], AutographaStore.currentTrans["dynamic-msg-went-wrong"], "error");
				return
			}
		});
  		if(AutographaStore.selectedParaTextBook[projectId] == null || Object.keys(AutographaStore.selectedParaTextBook[projectId]).length == 0){
        	swal(AutographaStore.currentTrans["dynamic-msg-error"], AutographaStore.currentTrans["label-selection"], "error");
  			return
  		}
		const currentTrans = AutographaStore.currentTrans;
	    let config = {headers: {
            Authorization: `Bearer ${AutographaStore.tempAccessToken}`
        }}
	    swal({
	        title: currentTrans["label-warning"],
	        text: currentTrans["label-override-text"],
	        icon: "warning",
	        buttons: [currentTrans["btn-ok"], currentTrans["btn-cancel"]],
	        dangerMode: false,
	        closeOnClickOutside: false,
	        closeOnEsc: false
	      })
	      .then((action) => {
	        if (action) {
	        } else {
				this.props.showLoader(true)
	        	this.setState({importText: AutographaStore.currentTrans["label-importing"], isImporting: true})
	        	AutographaStore.selectedParaTextBook[projectId].map((bookId) => {
 	        		axios.get(`https://data-access.paratext.org/api8/text/${projectId}/${bookId}`, config).then((res) => {
					
		            let book = {};
                	let verse = [];
                	let chapters = {};
		            let parser = new DOMParser();
					let xmlDoc = parser.parseFromString(res.data,"text/xml");
					let childNodes = xmlDoc.getElementsByTagName('usx')[0].childNodes;
					let verseNodes = [];
					
					//creating dir in userdata path and writing file as book name of paratext
					if (!fs.existsSync(dir)){
						fs.mkdirSync(dir);
					}
					fs.writeFileSync(path.join(app.getPath('userData'), 'paratext_book', `${bookId}.xml`), res.data, 'utf8');
					//end

					if (xmlDoc.evaluate) {
						let chapterNodes =  xmlDoc.evaluate("//chapter", xmlDoc, null, XPathResult.ANY_TYPE, null);
						let verseNodes = xmlDoc.evaluate("//verse", xmlDoc, null, XPathResult.ANY_TYPE, null);
						let currChapter=chapterNodes.iterateNext();
						book[currChapter.attributes["number"].value] = []
						let currVerse = verseNodes.iterateNext();
						while(currVerse){
							if(currVerse.attributes["number"].value == 1 && book[currChapter.attributes["number"].value].length != 0){
								currChapter = chapterNodes.iterateNext();
								book[currChapter.attributes["number"].value] = [];
							}
							book[currChapter.attributes["number"].value].push({verse_number: currVerse.attributes["number"].value, verse: currVerse.nextSibling !== null ? (currVerse.nextSibling.data !== undefined ? currVerse.nextSibling.data : "")   : ""})
							currVerse = verseNodes.iterateNext();
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
	                                    doc.chapters[i].verses[verseNum - 1].verse = book[j][k].verse;
	                                    book[j][k] = undefined;
	                                }
	                                //check for extra verses in the imported usfm here.
	                                break;
	                            }
	                        }
	                    }
	                    db.put(doc).then((response) => {
							this.resetLoader();
							//swal({AutographaStore.currentTrans["btn-import"], AutographaStore.currentTrans["label-imported-book"], "success");
							swal({
								title: AutographaStore.currentTrans["btn-import"],
								text:  AutographaStore.currentTrans["label-imported-book"],
								icon: "success",
								dangerMode: false,
								closeOnClickOutside: false,
								closeOnEsc: false
							  })
							  .then((action) => {
								if(action){
									window.location.reload();
								}
							  })

	                    }).catch((err) => {
							console.log(err);
							this.resetLoader();
							swal(AutographaStore.currentTrans["dynamic-msg-error"], AutographaStore.currentTrans["dynamic-msg-went-wrong"], "error");
						});
                	});
					// console.log(book)
		        	}).catch((err) => {
						console.log(err);
						this.resetLoader();
						swal(AutographaStore.currentTrans["dynamic-msg-error"], AutographaStore.currentTrans["dynamic-msg-went-wrong"], "error");

					})
 	        	})
	        }
	    });
  	}
  	uploadBook = (projectId) => {
		let book = {};
        if(AutographaStore.selectedParaTextBook[projectId] == null || Object.keys(AutographaStore.selectedParaTextBook[projectId]).length == 0){
        	swal(AutographaStore.currentTrans["dynamic-msg-error"], AutographaStore.currentTrans["label-selection"], "error");
  			return
		}
		this.props.setToken(AutographaStore.userName, AutographaStore.password).then((res)=>{
			if (!res){
				swal(AutographaStore.currentTrans["dynamic-msg-error"], AutographaStore.currentTrans["dynamic-msg-went-wrong"], "error");
				return
			}
		});
  		let config = {headers: {
            Authorization: `Bearer ${AutographaStore.tempAccessToken}`
        }}
		this.props.showLoader(true);		  
  		AutographaStore.selectedParaTextBook[projectId].map((bookId) => {
			
  			axios.get(`https://data-access.paratext.org/api8/revisions/${projectId}/${bookId}`, config).then((res) => {
				let parser = new xml2js.Parser();
				let xmlBook = fs.readFileSync(`${app.getPath('userData')}/paratext_book/${bookId}.xml`, 'utf8');
				const xmlDoc =  new DOMParser().parseFromString(xmlBook,"text/xml");
	            parser.parseString(res.data, (err, result) => {
	            	let revision = result.RevisionInfo.ChapterInfo[0].$.revision;
	            	//let usx = `<usx version="3.0">`
	            	//usx += `<book code="${bookId}" style="id"></book>`
	            	db.get(AutographaStore.bookId.toString()).then((doc) => {
	            		console.log(doc.chapters)
	            		doc.chapters.map((chapter) => {
	            			//usx+= `<chapter number="${chapter.chapter}" style="c" />`
	            			chapter.verses.map((verse) => {
	            				//usx += `<verse number="${verse.verse_number}" style="v" />${verse.verse}`
	            			})
	            		})
						//usx+=`</usx>`
						if (xmlDoc.evaluate) {
							let chapterNodes =  xmlDoc.evaluate("//chapter", xmlDoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
							let verseNodes = xmlDoc.evaluate("//verse", xmlDoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

							//let currChapter=chapterNodes.iterateNext();
							//book[currChapter.attributes["number"].value] = []
							//let currVerse = verseNodes.iterateNext();

							for ( var i=0 ; i < verseNodes.snapshotLength; i++ ){
								verseNodes.snapshotItem(i).nextSibling.data = "dkjakdkakda";
								console.log(verseNodes.snapshotItem(i).nextSibling.data)

							}


							// while(currVerse){
							// 	console.log(currChapter.attributes["number"].value)
							// 	let verse = doc.chapters[currChapter.attributes["number"].value-1].verses[currVerse.attributes["number"].value-1];
								
							// 	if(currVerse.attributes["number"].value == 1 && book[currChapter.attributes["number"].value].length != 0){
							// 		currChapter = chapterNodes.iterateNext();
							// 		book[currChapter.attributes["number"].value] = [];
							// 	}
							// 	//console.log(currChapter)
								
							// 	console.log(verse)
								
							// 	if(currVerse.nextSibling){
									
							// 		currVerse.nextSibling.data = verse.verse;
							// 	}
							// 	book[currChapter.attributes["number"].value].push({verse_number: currVerse.attributes["number"].value, verse: currVerse.nextSibling !== null ? (currVerse.nextSibling.data !== undefined ? currVerse.nextSibling.data : "")   : ""})
							// 	currVerse = verseNodes.iterateNext();
							// }
						}
						//let xmlBookUpdated = fs.readFileSync(`${app.getPath('userData')}/paratext_book/${bookId}.xml`, 'utf8');
						console.log(xmlDoc)
						return

	            		let postConfig = {headers: {
            				Authorization: `Bearer ${AutographaStore.tempAccessToken}`,
            				'Content-Type': "application/x-www-form-urlencoded"
        				}}
	            		axios.post(`https://data-access.paratext.org/api8/text/${projectId}/${revision}/${bookId}/`, usx, postConfig).then((res) => {
							this.props.showLoader(false);
							swal("Success", "Successfully uploaded data.", "success");
	            		}).catch((err) => {
							this.props.showLoader(false);
							swal(AutographaStore.currentTrans["dynamic-msg-error"], AutographaStore.currentTrans["dynamic-msg-went-wrong"], "error");
	            		});
            		}).catch((err) => {
						console.log(err)
						this.props.showLoader(false);
						swal(AutographaStore.currentTrans["dynamic-msg-error"], AutographaStore.currentTrans["dynamic-msg-went-wrong"], "error");
            		});
	            });
  			}).catch((err) => {
				console.log(err)
				this.props.showLoader(false);
				swal(AutographaStore.currentTrans["dynamic-msg-error"], AutographaStore.currentTrans["dynamic-msg-went-wrong"], "error");
  			});
  		});
  	}
  	render (){
  		const {project, index} = this.props;
	  		return (
	  			<Panel eventKey={index+1}>
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
						<div style={{float: "right"}}>
				    		<Button type="button" className="margin-right-10 btn btn-success" onClick={() =>{ this.importBook(project.projid[0])} } disabled={this.state.isImporting ? true : false}>{this.state.importText}</Button>
				    		<Button type="button" className = "margin-right-10 btn btn-success" onClick={() =>{ this.uploadBook(project.projid[0])} } disabled={this.state.isImporting ? true : false}>Upload</Button>
						</div>
				    </Panel.Body>
				</Panel>
			);
	};
}
ProjectListRow.propTypes = {
  project: PropTypes.object.isRequired
};
export default ProjectListRow;