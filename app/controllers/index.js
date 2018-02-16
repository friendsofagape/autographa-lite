// const session = require('electron').remote.session;
// const { dialog } = require('electron').remote;
// var bibUtil = require("../util/json_to_usfm.js"),
//     DiffMatchPatch = require('diff-match-patch'),
//     dmp_diff = new DiffMatchPatch();

// var db = require(`${__dirname}/../util/data-provider`).targetDb(),
//     refDb = require(`${__dirname}/../util/data-provider`).referenceDb(),
//     lookupsDb = require(`${__dirname}/../util/data-provider`).lookupsDb(),
//     book,
//     chapter,
//     currentBook,
//     intervalId;


// var constants = require('../util/constants.js'),
//     booksList = constants.booksList,
//     otBookStart = 1,
//     otBookEnd = 39,
//     ntBookStart = 40,
//     ntBookEnd = 66,
//     allBookStart = 1,
//     allBookEnd = 66;

// var stringReplace = require('../util/string_replace.js'),
//     replaceCount = 0,
//     allChapterReplaceCount = [],
//     replacedChapter = {},
//     replacedVerse = {},
//     allChapters = {},
//     chapter_hash = {},
//     verses_arr = [],
//     chapter_arr = [],
//     diffModeFlag = false,
//     targetDirtyFlag = false,

//     bibUtil_to_json = require(`${__dirname}/../util/usfm_to_json`),
//     fs = require("fs"),
//     path = require("path"),
//     codeClicked = false,
//     constants = require(`${__dirname}/../util/constants.js`),
//     removeReferenceLink = '',
//     ref_select = '';
// /*
//  $(document).ready(function(){
// document.getElementById("save-btn").addEventListener("click", function(e) {
//     var verses = currentBook.chapters[parseInt(chapter, 10) - 1].verses;
//     verses.forEach(function(verse, index) {
//         var vId = 'v' + (index + 1);
//         verse.verse = document.getElementById(vId).textContent;
//     });

//     currentBook.chapters[parseInt(chapter, 10) - 1].verses = verses;
//     db.get(currentBook._id).then(function(doc) {
//         doc.chapters[parseInt(chapter, 10) - 1].verses = verses;
//         db.put(doc).then(function(response) {
//             alertModal("Translation Data", "Successfully saved changes");
//         }).catch(function(err) {
//             console.log(err);
//         });
//     }).catch(function(err) {
//         console.log('Error: While retrieving document. ' + err);
//     });
// });
// });*/

// function createVerseInputs(verses, chunks, chapter) {
//     document.getElementById('input-verses').innerHTML = "";
//     var i, chunkIndex = 0,
//         chunkVerseStart, chunkVerseEnd;
//     for (i = 0; i < chunks.length; i++) {
//         if (parseInt(chunks[i].chp, 10) === parseInt(chapter, 10)) {
//             chunkIndex = i + 1;
//             chunkVerseStart = parseInt(chunks[i].firstvs, 10);
//             chunkVerseEnd = parseInt(chunks[i + 1].firstvs, 10) - 1;
//             break;
//         }
//     }

//     for (i = 1; i <= verses.length; i++) {
//         var divContainer = document.createElement('div'),
//             spanVerseNum = document.createElement('span'),
//             spanVerse = document.createElement('span');
//         if (i > chunkVerseEnd) {
//             chunkVerseStart = parseInt(chunks[chunkIndex].firstvs, 10);
//             if (chunkIndex === chunks.length - 1 || parseInt((chunks[chunkIndex + 1].chp), 10) != chapter) {
//                 chunkVerseEnd = verses.length;
//             } else {
//                 chunkIndex++;
//                 chunkVerseEnd = parseInt(chunks[chunkIndex].firstvs, 10) - 1;
//             }
//         }
//         var chunk = chunkVerseStart + '-' + chunkVerseEnd;
//         spanVerse.setAttribute("chunk-group", chunk);
//         spanVerse.contentEditable = true;
//         spanVerse.id = "v" + i;
//         spanVerse.appendChild(document.createTextNode(verses[i - 1].verse));
//         spanVerseNum.setAttribute("class", "verse-num");
//         spanVerseNum.appendChild(document.createTextNode(i));
//         divContainer.appendChild(spanVerseNum);
//         divContainer.appendChild(spanVerse);
//         document.getElementById('input-verses').appendChild(divContainer);
//         $(".diff-count-target").html("");
//     }
//     highlightRef();
// }

// function lastVisitFromSession(success, failure) {

//     // session.defaultSession.cookies.get({ url: 'http://book.autographa.com' }, (error, cookie) => {
//     //     if (cookie.length > 0) {
//     //         book = cookie[0].value;
//     //         session.defaultSession.cookies.get({ url: 'http://chapter.autographa.com' }, (error, cookie) => {
//     //             if (cookie.length > 0) {
//     //                 chapter = cookie[0].value;
//     //                 // initializeTextInUI(book, chapter);
//     //                 success(book, chapter);
//     //             } else {
//     //                 failure();
//     //             }
//     //         });
//     //     } else {
//     //         failure();
//     //     }
//     // });
// }

// function lastVisitFromDB(success) {
//     // refDb.get("ref_history")
//     //     .then(function(doc) {
//     //         book = doc.visit_history[0].bookId;
//     //         chapter = doc.visit_history[0].chapter;
//     //         var cookie = { url: 'http://book.autographa.com', name: 'book', value: book };
//     //         session.defaultSession.cookies.set(cookie, (error) => {
//     //             if (error)
//     //                 console.error(error);
//     //             var cookie = { url: 'http://chapter.autographa.com', name: 'chapter', value: chapter };
//     //             session.defaultSession.cookies.set(cookie, (error) => {
//     //                 if (error)
//     //                     console.error(error);
//     //                 success(book, chapter);
//     //             });
//     //         });
//     //     }).catch(function(err) {
//     //         console.log('Error: While retrieving document. ' + err);
//     //     });
// }



// function initializeTextInUI(book, chapter) {
//     console.log(book);
//     document.getElementById('book-chapter-btn').innerHTML = booksList[parseInt(book, 10) - 1];
//     document.getElementById('chapterBtnSpan').innerHTML = '<a  id="chapterBtn" data-toggle="tooltip" data-placement="bottom"  title="Select Chapter" class="btn btn-default" href="javascript:getBookChapterList(' + "'" + book + "'" + ');" >' + chapter + '</a>'
//     $('[data-toggle=tooltip]').tooltip();
//     db.get(book).then(function(doc) {
//         refDb.get('refChunks').then(function(chunkDoc) {
//             // console.log(doc.chapters[parseInt(chapter,10)-1].verses.length);
//             currentBook = doc;
//             // createRefSelections();
//             createVerseInputs(doc.chapters[parseInt(chapter, 10) - 1].verses, chunkDoc.chunks[parseInt(book, 10) - 1], chapter);
//         });
//     }).catch(function(err) {
//         console.log('Error: While retrieving document. ' + err);
//     });
// }

// // Get last viewed book and chapter either from session or from DB, in that order.
// lastVisitFromSession(
//     function(book, chapter) {
//         initializeTextInUI(book, chapter);
//     },
//     function() {
//         lastVisitFromDB(initializeTextInUI);
//     }
// );

// function getDiffText(refId1, refId2, position, callback) {
//     var t_ins = 0;
//     var t_del = 0;
//     var id1 = refId1 + '_' + bookCodeList[parseInt(book, 10) - 1],
//         id2 = refId2 + '_' + bookCodeList[parseInt(book, 10) - 1],
//         i,
//         ref1 = "",
//         ref2 = "";
//     session.defaultSession.cookies.get({ url: 'http://chapter.autographa.com' }, (error, cookie) => {
//         if (cookie.length > 0) {
//             chapter = cookie[0].value;
//         }
//     });
//     refDb.get(id1).then(function(doc) {
//         for (i = 0; i < doc.chapters.length; i++) {
//             if (doc.chapters[i].chapter == parseInt(chapter, 10)) {
//                 break;
//             }
//         }
//         return doc.chapters[i].verses
//     }).then(function(response) {
//         ref1 = response;
//         refDb.get(id2).then(function(doc) {
//             for (i = 0; i < doc.chapters.length; i++) {
//                 if (doc.chapters[i].chapter == parseInt(chapter, 10)) {
//                     break;
//                 }
//             }
//             ref2 = doc.chapters[i].verses
//             var refString = "";
//             for (var i = 1; i <= ref1.length; i++) {
//                 var d = dmp_diff.diff_main(ref1[i - 1].verse, ref2[i - 1].verse);
//                 var diff_count = getDifferenceCount(d);
//                 t_ins += diff_count["ins"]
//                 t_del += diff_count["del"]
//                 var ds = dmp_diff.diff_prettyHtml(d);
//                 refString += '<div data-verse="r' + (i) + '"><span class="verse-num">' + (i) + '</span><span>' + ds + '</span></div>';
//             }
//             callback(null, refString, position, t_ins, t_del);
//         });
//     }).catch(function(err) {
//         callback(err, null, null);
//     });
// }

// // insertion and deletion count in difference text by passing verse
// function getDifferenceCount(verse_diff) {
//     var insertions = 0;
//     var deletions = 0;
//     for (var x = 0; x < verse_diff.length; x++) {
//         var op = verse_diff[x][0];
//         var data = verse_diff[x][1];
//         switch (op) {
//             case DiffMatchPatch.DIFF_INSERT:
//                 insertions += data.length;
//                 break;
//             case DiffMatchPatch.DIFF_DELETE:
//                 deletions += data.length;
//                 break;
//             case DiffMatchPatch.DIFF_EQUAL:
//                 insertions = 0;
//                 deletions = 0;
//                 break;
//         }
//     }
//     return { ins: insertions, del: deletions }
// }
// // End insertion and deletion count in difference text

// // save document after edit
// function setDiffReferenceText() {
//     // save document after edit
//     saveTarget();

//     //set difference
//     var j = 0;
//     for (j = 0; j < $('.ref-drop-down :selected').length; j++) {
//         $("#section-" + j).find('div[type="ref"]').children().removeAttr("style");
//         if (j + 1 < $('.ref-drop-down :selected').length) {
//             getDiffText($($('.ref-drop-down :selected')[j]).val(), $($('.ref-drop-down :selected')[j + 1]).val(), j + 1, function(err, refContent, pos, t_ins, t_del) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     $("#section-" + pos).find('div[type="ref"]').html(refContent);
//                     $("#section-" + pos).find('.diff-count').html("<span>(+): " + t_ins + "</span><span> (-): " + t_del + "</span></span>");
//                     t_ins = 0;
//                     t_del = 0;
//                 }
//             });
//         }
//     }
//     session.defaultSession.cookies.get({ url: 'http://book.autographa.com' }, (error, cookie) => {
//         book = '1';
//         if (cookie.length > 0) {
//             book = cookie[0].value;
//         }
//     });
//     session.defaultSession.cookies.get({ url: 'http://chapter.autographa.com' }, (error, cookie) => {
//         if (cookie.length > 0) {
//             chapter = cookie[0].value;
//         }
//     });
//     var book_verses = '';
//     refId = $($('.ref-drop-down :selected')[j - 1]).val();
//     refId = (refId === 0 ? document.getElementById('refs-select').value : refId);
//     var id = refId + '_' + bookCodeList[parseInt(book, 10) - 1],
//         i;
//     refDb.get(id).then(function(doc) {
//         for (i = 0; i < doc.chapters.length; i++) {
//             if (doc.chapters[i].chapter == parseInt(chapter, 10)) {
//                 break;
//             }
//         }
//         book_verses = doc.chapters[i].verses
//     }).catch(function(err) {
//         console.log(err);
//     });
//     db.get(book).then(function(doc) {
//         refDb.get('refChunks').then(function(chunkDoc) {
//             currentBook = doc;
//             createVerseDiffInputs(doc.chapters[parseInt(chapter, 10) - 1].verses, chunkDoc.chunks[parseInt(book, 10) - 1], chapter, book_verses);
//         }).catch(function(err) {
//             console.log(err);
//         });
//     }).catch(function(err) {
//         console.log('Error: While retrieving document. ' + err);
//     });
// }

// function setReferenceTextBack() {
//     var j = 0;
//     $('.ref-drop-down :selected').each(function(i, selected) {
//         getReferenceText($(selected).val(), function(err, refContent) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 $("#section-" + i).find('div[type="ref"]').html(refContent);
//                 $("#section-" + i).find('.diff-count').html("");
//             }
//         });
//     });
//     session.defaultSession.cookies.get({ url: 'http://book.autographa.com' }, (error, cookie) => {
//         book = '1';
//         if (cookie.length > 0) {
//             book = cookie[0].value;
//         }
//     });
//     session.defaultSession.cookies.get({ url: 'http://chapter.autographa.com' }, (error, cookie) => {
//         if (cookie.length > 0) {
//             chapter = cookie[0].value;
//         }
//     });
//     db.get(book).then(function(doc) {
//         refDb.get('refChunks').then(function(chunkDoc) {
//             currentBook = doc;
//             createVerseInputs(doc.chapters[parseInt(chapter, 10) - 1].verses, chunkDoc.chunks[parseInt(book, 10) - 1], chapter);
//         }).catch(function(err) {
//             console.log(err);
//         });
//     }).catch(function(err) {
//         console.log('Error: While retrieving document. ' + err);
//     });
// }

// function createVerseDiffInputs(verses, chunks, chapter, book_original_verses) {
//     var t_ins = 0;
//     var t_del = 0;
//     document.getElementById('input-verses').innerHTML = "";
//     var i, chunkIndex = 0,
//         chunkVerseStart, chunkVerseEnd;
//     for (i = 0; i < chunks.length; i++) {
//         if (parseInt(chunks[i].chp, 10) === parseInt(chapter, 10)) {
//             chunkIndex = i + 1;
//             chunkVerseStart = parseInt(chunks[i].firstvs, 10);
//             chunkVerseEnd = parseInt(chunks[i + 1].firstvs, 10) - 1;
//             break;
//         }
//     }

//     for (i = 1; i <= verses.length; i++) {
//         var divContainer = '<div>';
//         spanVerseNum = '';

//         if (i > chunkVerseEnd) {
//             chunkVerseStart = parseInt(chunks[chunkIndex].firstvs, 10);
//             if (chunkIndex === chunks.length - 1 || parseInt((chunks[chunkIndex + 1].chp), 10) != chapter) {
//                 chunkVerseEnd = verses.length;
//             } else {
//                 chunkIndex++;
//                 chunkVerseEnd = parseInt(chunks[chunkIndex].firstvs, 10) - 1;
//             }
//         }
//         var chunk = chunkVerseStart + '-' + chunkVerseEnd;
//         spanVerse = "<span chunk-group=" + chunk + " id=v" + i + ">";
//         var d = dmp_diff.diff_main(book_original_verses[i - 1].verse, verses[i - 1].verse);
//         var ds = dmp_diff.diff_prettyHtml(d);
//         var diff_count = getDifferenceCount(d);
//         t_ins += diff_count["ins"];
//         t_del += diff_count["del"];
//         spanVerse += ds;
//         spanVerse += '</span>'
//         spanVerseNum += '<span class="verse-num">' + i + '</span>' //appendChild(document.createTextNode(i));
//         divContainer += spanVerseNum;
//         divContainer += spanVerse;
//         divContainer += '</div>'
//         $("#input-verses").append(divContainer);

//     }
//     $(".diff-count-target").html("<span>(+): " + t_ins + "</span><span> (-): " + t_del + "</span></span>");
//     highlightRef();
// }


// var bookCodeList = constants.bookCodeList;

// function getReferenceText(refId, callback) {
//     refId = (refId === 0 ? document.getElementById('refs-select').value : refId);
//     var id = refId + '_' + bookCodeList[parseInt(book, 10) - 1],
//         i;
//     session.defaultSession.cookies.get({ url: 'http://chapter.autographa.com' }, (error, cookie) => {
//         refDb.get('ref_history').then(function(doc) {
//             chapter = doc.visit_history[0].chapter;
//             if (cookie.length > 0) {
//                 chapter = cookie[0].value;
//             }
//             refDb.get(id).then(function(doc) {
//                 for (i = 0; i < doc.chapters.length; i++) {
//                     if (doc.chapters[i].chapter == parseInt(chapter, 10)) {
//                         break;
//                     }
//                 }
//                 ref_string = doc.chapters[i].verses.map(function(verse, verseNum) {
//                     return '<div data-verse="r' + (verseNum + 1) + '"><span class="verse-num">' + (verseNum + 1) + '</span><span>' + verse.verse + '</span></div>';
//                 }).join('');
//                 callback(null, ref_string);
//             }).catch(function(err) {
//                 callback(err, "");
//             });
//         });
//     });
// }

// function createRefSelections() {
//     if ($(".ref-drop-down").val() === null) {
//         $(".ref-drop-down").find('option').remove().end();
//         refDb.get('refs').then(function(doc) {
//             doc.ref_ids.forEach(function(ref_doc) {
//                 if (ref_doc.isDefault) {
//                     $('button[role="ref-selector"]').text(ref_doc.ref_name);
//                     $(".current-val").val(ref_doc.ref_id);
//                     getReferenceText(ref_doc.ref_id, function(err, refContent) {
//                         if (err) {
                            
//                             console.log('Info: No references found in database. ' + err);
//                             return;
//                         }
//                         $('div[type="ref"]').html(refContent);

//                     });
//                 }
//                 /*==================== old drop down commented =============================*/
//                 //    var li = document.createElement('li'),
//                 // a = document.createElement('a');
//                 //    a.setAttribute('href', '#');
//                 //    a.setAttribute('data-value', ref_doc.ref_id);
//                 //    a.setAttribute('type', 'ref-selection');
//                 //    var t = document.createTextNode(ref_doc.ref_name);
//                 //    a.appendChild(t);
//                 //    li.appendChild(a);
//                 //    $('ul[type="refs-list"]').append(li);

//                 /*==============================================================*/
//                 $('<option></option>').val(ref_doc.ref_id).text(ref_doc.ref_name).appendTo(".ref-drop-down"); //new code for ref drop down

//             });
//         });
//     } else {
//         var refCookieValue = {}
//         session.defaultSession.cookies.get({ url: 'http://refs.autographa.com' }, (error, cookie) => {
//             if (cookie.length > 0) {
//                 $.each(cookie, function(i, v){
//                     refCookieValue[v.name.toString()] = v.value
//                 });
//                 $.each(refCookieValue, function(i, val){
//                     if($('.ref-drop-down')[i] && $('.ref-drop-down')[i].length > 0 ){
//                         $('.ref-drop-down')[i].value = val;
//                         $(".current-val")[i].value = val;
//                     }
//                     getReferenceText(val, function(err, refContent) {
//                         if (err) {
//                             $(".ref-drop-down")[i].value = val;
//                             getReferenceText(val, function(err, refContent) {
//                                 if (err) {
//                                     console.log("This chapter is not available in the selected reference version.");
//                                 }
//                                 $('div[type="ref"]').html(refContent);
//                             })
//                             return;
//                         }
//                         $("#section-" + i).find('div[type="ref"]').html(refContent);
//                     });
//                 });
//             }else {
//                 $('.ref-drop-down :selected').each(function(i, selected) {
//                     $(".current-val").val($(selected).val());
//                     getReferenceText($(selected).val(), function(err, refContent) {
//                         if (err) {
//                             $(".ref-drop-down").val($(".ref-drop-down option:first").val());
//                             getReferenceText($(".ref-drop-down option:first").val(), function(err, refContent) {
//                                 if (err) {
//                                     console.log("This chapter is not available in the selected reference version.");
//                                 }
//                                 $('div[type="ref"]').html(refContent);
//                             })
//                             return;
//                         }
//                         if ($("#section-" + i).length > 0) {
//                             $("#section-" + i).find('div[type="ref"]').html(refContent);
//                         } else {
//                             $('div[type="ref"]').html(refContent);
//                         }
//                     });
//                 });
//             } 
//         });
//     }
// }
// // $(document).ready(function(){
// $('.ref-drop-down').change(function(event) {
//     var selectedRefElement = $(this);
//     var cookieRef = { url: 'http://refs.autographa.com', name: selectedRefElement.next().next().val().toString() , value: selectedRefElement.val() };
//     session.defaultSession.cookies.set(cookieRef, (error) => {
//         if (error)
//             console.log(error);
//     });
//     getReferenceText($(this).val(), function(err, refContent) {
//         if (err) {
//             selectedRefElement.val(selectedRefElement.next().val());
//             console.log(err);
//             alertModal("Error", "This chapter is not available in the selected reference version.");
//             return;
//         } else {
//             selectedRefElement.next().val(selectedRefElement.val());

//         }
//         selectedRefElement.closest('div.row').next('div.row').children('div[type="ref"]').html(refContent);
//     });
// });
// // });

// // function highlightRef() {
// //     var i,
// //         j,
// //         verses = document.querySelectorAll("span[id^=v]");
// //     for (i = 0; i < verses.length; i++) {
// //         verses[i].addEventListener("focus", function(e) {
// //             var limits = e.target.getAttribute("chunk-group").split("-").map(function(element) {
// //                 return parseInt(element, 10) - 1;
// //             });
// //             $('div[data-verse^="r"]').css({ "background-color": "", "font-weight": "", "padding-left": "10px", "padding-right": "10px" });
// //             for (j = limits[0]; j <= limits[1]; j++) {
// //                 $('div[data-verse="r' + (j + 1) + '"]').css({ "background-color": "rgba(11, 130, 255, 0.1)",  "padding-left": "10px", "padding-right": "10px", "margin-right": "10px" });
// //             }
// //             $('div[data-verse="r' + (limits[0] + 1) + '"]').css({ "border-radius": "10px 10px 0px 0px" });
// //             $('div[data-verse="r' + (limits[1] + 1) + '"]').css({ "border-radius": "0px 0px 10px 10px" });

// //         });
// //     }
// // }

// // Multi-reference windows
// function setMultiwindowReference(layout) {

//     /*var children = $('div.row-col-fixed').children(),
//         editor = children[children.length - 1],
//         i,
//         clone,
//         count = 1;
//     if (layout === '2x') {
//         if (children.length === 2) {
//             return;
//         }
//         for (i = 0; i < children.length; i++) {
//             $(children[i]).removeClass(function(index, css) {
//                 return (css.match(/(^|\s)col-sm-\S+/g) || []).join(' ');
//             });
//             $(children[i]).addClass('col-sm-6');
//         }
//         if (children.length > 2) {
//             for (i = 1; i < children.length - 1; i++) {
//                 children[i].remove();
//             }
//         }
//     } else if (layout === '3x') {
//         if (children.length === 3) {
//             return;
//         }
//         for (i = 0; i < children.length; i++) {
//             $(children[i]).removeClass(function(index, css) {
//                 return (css.match(/(^|\s)col-sm-\S+/g) || []).join(' ');
//             });
//             $(children[i]).addClass('col-sm-4').attr("id", "section-" + i);

//         }
//         if (children.length > 3) {
//             children[2].remove();
//         } else if (children.length < 3) {
//             element = $(children[0]).clone(true, true);
//             //var newID = element.attr('id').replace(/\d+$/, function(str) { return parseInt(str) + 1});
//             clone_ele = $(children[0]).clone(true, true).attr("id", "section-1").insertBefore('div.col-editor');
//             clone_ele.find(".ref-drop-down").val(clone_ele.find(".current-val").val());
//             clone_ele.find(".current-pos").val('0');
//             var refVal = clone_ele.find(".current-val").val()
//             if(refVal != ""){
//                 console.log(refVal)
//                 var cookieRef = { url: 'http://refs.autographa.com', name: "1" , value: refVal };
//                 session.defaultSession.cookies.set(cookieRef, (error) => {
//                     if (error)
//                         console.log(error);
//                 });
//             }
//             //element.attr("id", newID).insertBefore('div.col-editor');
//         }
//     } else if (layout === '4x') {
//         if (children.length === 4) {
//             return;
//         }
//         for (i = 0; i < children.length; i++) {

//             $(children[i]).removeClass(function(index, css) {
//                 return (css.match(/(^|\s)col-sm-\S+/g) || []).join(' ');
//             });
//             $(children[i]).addClass('col-sm-3').attr("id", "section-" + i);
//             if (i == 2) {
//                 count = 2;
//             }

//         }
//         for (i = 0; i < (4 - children.length); i++) {
//             clone_ele = $(children[0]).clone(true, true).attr("id", "section-" + count).insertBefore('div.col-editor');
//             clone_ele.find(".ref-drop-down").val(clone_ele.find(".current-val").val());
//             clone_ele.find(".current-pos").val(count);
//             var refVal = clone_ele.find(".current-val").val()
//             if(refVal != ""){
//                 var cookieRef = { url: 'http://refs.autographa.com', name: "2" , value: refVal };
//                 session.defaultSession.cookies.set(cookieRef, (error) => {
//                     if (error)
//                         console.log(error);
//                 });
//             }
//             count = count + 1;
//         }
//     }*/

// }

// $('a[role="multi-window-btn"]').click(function() {
//     setMultiwindowReference($(this).data('output'));
//     saveReferenceLayout($(this).data('output'));
// });

// function createBooksList(booksLimit) {
//     document.getElementById('books-pane').innerHTML = "";
//     for (var i = 1; i <= booksLimit; i++) {
//         var li = document.createElement('li'),
//             a = document.createElement('a'),
//             bookName = document.createTextNode(constants.booksList[i - 1]);
//         a.id = 'b' + i;
//         a.setAttribute('href', "javascript:setBookName(" + "'" + "b" + i + "'" + ")");
//         a.appendChild(bookName);
//         li.appendChild(a);
//         document.getElementById('books-pane').appendChild(li);
//     }
//     session.defaultSession.cookies.get({ url: 'http://book.autographa.com' }, (error, cookie) => {
//         if (cookie.length > 0) {
//             book = cookie[0].value;
//             $("#b" + book).addClass("link-active");
//             $("#c" + $("#chapterBtn").text()).addClass("link-active");
//         } else {
//             refDb.get("ref_history").then(function(doc) {
//                 book = doc.visit_history[0].bookId;
//                 chapter = doc.visit_history[0].chapter;
//                 $("#b" + book).addClass("link-active");
//                 $("#c" + chapter).addClass("link-active");
//             });
//         }
//     });
// }

// function createChaptersList(chaptersLimit) {
//     document.getElementById('chaptersList').innerHTML = "";
//     for (var i = 1; i <= chaptersLimit; i++) {
//         var li = document.createElement('li'),
//             a = document.createElement('a'),
//             chapterNumber = document.createTextNode(i);
//         a.id = 'c' + i;
//         a.setAttribute('href', "javascript:setChapter(" + "'" + i + "'" + ")");
//         a.appendChild(chapterNumber);
//         li.appendChild(a);
//         document.getElementById('chaptersList').appendChild(li);
//         a.addEventListener('click', function(e) {
//             const cookie = { url: 'http://chapter.autographa.com', name: 'chapter', value: e.target.id.substring(1) };
//             session.defaultSession.cookies.set(cookie, (error) => {
//                 if (error)
//                     console.error(error);
//             });
//         });
//     }
// }

// function setBookName(bookId) {
//     $(".selected ul li a").removeClass("link-active");
//     $("#" + bookId).addClass("link-active");
//     db.get(bookId.substring(1).toString()).then(function(doc) {
//         book = bookId.substring(1).toString();
//         // setChapterCookie('0');
//         createChaptersList(doc.chapters.length);
//         $('#booksTab').removeClass('is-active');
//         $('#books-panel').removeClass('is-active');
//         $("#chapterTab").addClass('is-active');
//         $("#chapters-panel").addClass("is-active");
//     }).catch(function(err) {
//         closeModal($("#books"));
//         console.log('Error: While retrieving document. ' + err);
//     });

// }


// function setChapter(chapter) {
//     db.get(book).then(function(doc) {
//         refDb.get('refChunks').then(function(chunkDoc) {
//             currentBook = doc;
//             chapter = chapter;
//             createRefSelections();
//             createVerseInputs(doc.chapters[parseInt(chapter, 10) - 1].verses, chunkDoc.chunks[parseInt(book, 10) - 1], chapter);
//         });
//         document.getElementById("bookBtn").innerHTML = '<a class="btn btn-default" data-toggle="tooltip" data-placement="bottom"  title="Select Book" href="javascript:getBookList();" id="book-chapter-btn">' + doc.book_name + '</a><span id="chapterBtnSpan"><a id="chapterBtn" class="btn btn-default" href="javascript:getBookChapterList(' + "'" + book + "'" + ')" >' + chapter + '</span></a>'
//         $('[data-toggle=tooltip]').tooltip();
//         setChapterButton(book, chapter);
//         setChapterCookie(chapter);
//         saveLastVisit(book, chapter);
//         closeModal($("#bookChapTabModal"));
//     }).catch(function(err) {
//         closeModal($("#bookChapTabModal"));
//         console.log('Error: While retrieving document. ' + err);
//     });

// }

// function setChapterButton(bookId, chapterId) {
//     document.getElementById('chapterBtnSpan').innerHTML = '<a id="chapterBtn" data-toggle="tooltip" data-placement="bottom"  title="Select Chapter" class="btn btn-default" class="btn btn-default" href="javascript:getBookChapterList(' + "'" + bookId + "'" + ');" >' + chapterId + '</a>'
//     $('[data-toggle=tooltip]').tooltip();
//     const cookie = { url: 'http://book.autographa.com', name: 'book', value: bookId };
//     session.defaultSession.cookies.set(cookie, (error) => {
//         if (error)
//             console.error(error);
//     });
// }

// function setChapterCookie(chapter) {
//     chapter = chapter;
//     value = (chapter === '0') ? '1' : chapter;
//     const cookie = { url: 'http://chapter.autographa.com', name: 'chapter', value: value };
//     session.defaultSession.cookies.set(cookie, (error) => {
//         if (error)
//             console.error(error);
//     });
// }


// function onBookSelect(bookId) {
//     const cookie = { url: 'http://book.autographa.com', name: 'book', value: bookId.substring(1) };
//     session.defaultSession.cookies.set(cookie, (error) => {
//         if (error)
//             console.error(error);
//     });
//     db.get(bookId.substring(1).toString()).then(function(doc) {
//         chaptersPane = document.getElementById("chapters-pane");
//         while (chaptersPane.lastChild) {
//             chaptersPane.removeChild(chaptersPane.lastChild);
//         }
//         createChaptersList(doc.chapters.length);
//     }).catch(function(err) {
//         console.log('Error: While retrieving document. ' + err);
//     });
// }


// function getBookList() {
//     createBooksList(66);
//     $("#bookChapTabModal").modal('toggle');
//     session.defaultSession.cookies.get({ url: 'http://book.autographa.com' }, (error, cookie) => {
//         if (cookie.length > 0) {
//             book = cookie[0].value;
//             db.get(book).then(function(doc) {
//                 createChaptersList(doc.chapters.length);
//                 $('#booksTab').addClass('is-active');
//                 $('#books-panel').addClass('is-active');
//                 $("#chapterTab").removeClass('is-active');
//                 $("#chapters-panel").removeClass("is-active");
//             }).catch(function(err) {
//                 closeModal($("#books"));
//                 console.log('Error: While retrieving document. ' + err);
//             });
//         }
//     });
// }
// // get book chapter list in popup
// // $(document).ready(function(){
//     function getBookChapterList(bookId) {
//         db.get(bookId).then(function(doc) {
//             createChaptersList(doc.chapters.length);
//             createBooksList(66);
//             $("#bookChapTabModal").modal('toggle');
//             $('#booksTab').removeClass('is-active');
//             $('#books-panel').removeClass('is-active');
//             $("#chapterTab").click().addClass('is-active');
//             $("#chapters-panel").addClass("is-active");

//         }).catch(function(err) {
//             console.log('Error: While retrieving document. ' + err);
//         });
//     }
// // });
// //end book chapter list

// function closeModal(modal) {
//     modal.modal('hide');
// }

// //validation for export
// document.getElementById('export-usfm').addEventListener('click', function(e) {
//     db.get('targetBible').then(function(doc) {
//         refDb.get('refs').then(function(doc) {
//             exportChoice();
//         }).catch(function(err) {
//             // handle any errors
//             alertModal("Error", "Please enter Translation Details in the Settings to continue with Export.");
//         });
//     }).catch(function(err) {
//         // handle any errors
//         alertModal("Error", "Please enter Translation Details in the Settings to continue with Export.");
//     });
// });

// $("#exportUsfm").on("click", function() {
//     exportUsfm();
// })

// function exportChoice() {
//     $("#dropdownBtn").html("Stage in Translation" + ' <span class="caret"></span>');
//     $("#stageText").val('');
//     $("#exportChoice").modal();
//     $("#exportChoice").toggle();
// }

// function exportUsfm() {
//     // Reading the database object
//     session.defaultSession.cookies.get({ url: 'http://book.autographa.com' }, (error, cookie) => {
//         if (error) {
//             $("#exportChoice").modal('hide');
//             alertModal("Error", "Unable to process request.");
//             return;
//         }
//         book = {};
//         db.get('targetBible').then(function(doc) {
//             book.bookNumber = cookie[0].value;
//             book.bookName = constants.booksList[parseInt(book.bookNumber, 10) - 1];
//             book.bookCode = constants.bookCodeList[parseInt(book.bookNumber, 10) - 1];
//             book.outputPath = doc.targetPath;
//             filepath = bibUtil.toUsfm(book, $("#stageText").val(), doc);
//             return filepath;
//         }).then(function(filepath) {
//             $("#exportChoice").modal('hide');
//             alertModal("Book Exported", "Exported file at: " + filepath);
//             return;
//         }).catch(function(err) {
//             $("#exportChoice").modal('hide');
//             console.log('Error: Cannot get details from DB' + err);
//             alertModal("Error", "Please enter Translation Details in the Settings to continue.");
//         });
//     });
// }

// // Alert Model Function for dynamic message
// function alertModal(heading, formContent) {
//     $("#heading").html(heading);
//     $("#content").html(formContent);
//     $("#dynamicModal").modal();
//     $("#dynamicModal").toggle();
// }

// $("#otBooksBtn").on("click", function() {
//     getBooksByLimit(otBookStart, otBookEnd);
// });
// $("#ntBooksBtn").on("click", function() {
//     getBooksByLimit(ntBookStart, ntBookEnd);
// });


// $("#allBooksBtn").on("click", function() {
//     getBooksByLimit(allBookStart, allBookEnd);
// });

// $(document).ready(function(){
// function getBooksByLimit(start, booksLength) {
//     document.getElementById('books-pane').innerHTML = "";
//     for (var i = start; i <= booksLength; i++) {
//         var li = document.createElement('li'),
//             a = document.createElement('a'),
//             bookName = document.createTextNode(booksList[i - 1]);
//         a.id = 'b' + i;
//         a.setAttribute('href', "javascript:setBookName(" + "'" + "b" + i + "'" + ")");
//         a.appendChild(bookName);
//         li.appendChild(a);
//         document.getElementById('books-pane').appendChild(li);
//     }
//     $("#b"+currentBook._id).addClass('link-active')
// }
// });

// function saveReferenceLayout(layout) {
//     refDb.get('targetReferenceLayout').then(function(doc) {
//         refDb.put({
//             _id: 'targetReferenceLayout',
//             layout: layout,
//             _rev: doc._rev
//         })
//     }).catch(function(err) {
//         refDb.put({
//             _id: 'targetReferenceLayout',
//             layout: layout
//         }).catch(function(err) {
//             //refDb.close();
//         });
//     });
// }

// $(function() {
//     // $('#switch-2').bootstrapSwitch();
//     setReferenceSetting();
//     buildReferenceList();

//     refDb.get('targetReferenceLayout').then(function(doc) {
//         setMultiwindowReference(doc.layout);
//     }).catch(function(err) {
//         //Layout value unset.       
//     });
//     session.defaultSession.cookies.get({ url: 'http://book.autographa.com' }, (error, cookie) => {
//         if (cookie.length == 0) {
//             const cookie = { url: 'http://book.autographa.com', name: 'book', value: '1' };
//             session.defaultSession.cookies.set(cookie, (error) => {
//                 if (error)
//                     console.error(error);
//             });
//         }
//     });

//     session.defaultSession.cookies.get({ url: 'http://chapter.autographa.com' }, (error, cookie) => {
//         if (cookie.length == 0) {
//             const cookie = { url: 'http://chapter.autographa.com', name: 'chapter', value: '1' };
//             session.defaultSession.cookies.set(cookie, (error) => {
//                 if (error)
//                     console.error(error);
//             });
//         }
//     });

//     session.defaultSession.cookies.get({ url: 'http://refs.autographa.com' }, (error, cookie) => {
//         if(cookie.length < 2 ){
//             var cookieRefCol1 = { url: 'http://refs.autographa.com', name: '0', value: 'eng_ulb'};
//             session.defaultSession.cookies.set(cookieRefCol1, (error) => {
//                 if (error)
//                 console.log(error);
//             });
//             var cookieRefCol2 = { url: 'http://refs.autographa.com', name: '1', value: 'eng_ulb'};
//             session.defaultSession.cookies.set(cookieRefCol2, (error) => {
//                 if (error)
//                 console.log(error);
//             });
//             var cookieRefCol3 = { url: 'http://refs.autographa.com', name: '2', value: 'eng_ulb'};
//             session.defaultSession.cookies.set(cookieRefCol3, (error) => {
//                 if (error)
//                 console.log(error);
//             });
//         }
//     })
//     $(".dropdown-menu").on('click', 'li a', function() {
//         $(this).parent().parent().siblings(".btn:first-child").html($(this).text() + ' <span class="caret"></span>');
//         $(this).parent().parent().siblings(".btn:first-child").val($(this).text());
//         $("#stageText").val($(this).text());
//         $("#exportUsfm").prop('disabled', false);
//     });
//     $("#stageText").on("keyup", function() {
//         if ($(this).val().length > 0) {
//             $("#exportUsfm").prop('disabled', false);
//         } else {
//             $("#exportUsfm").prop('disabled', true);
//         }
//     });
// });
// //check same langauge in the reference
// function isSameLanguage() {
//     var verseLangCode = "",
//         check_value = false;
//     return db.get('targetBible').then(function(doc) {
//         verseLangCode = doc.targetLang;
//         languagedropDown = $(".ref-drop-down").length
//         for (var i = 0; i < languagedropDown - 1; i++) {
//             v1 = $($('.ref-drop-down :selected')[i]).val().split("_")[0]
//             v2 = ""
//             if ($($('.ref-drop-down :selected')[i + 1]).length) {
//                 v2 = $($('.ref-drop-down :selected')[i + 1]).val().split("_")[0]
//             }
//             if ((verseLangCode != v1) || (verseLangCode != v2)) {
//                 return false;
//             }
//         }
//         if (languagedropDown == 1) {
//             if ((verseLangCode != $($('.ref-drop-down :selected')[0]).val().split("_")[0])) {
//                 return false;
//             }
//         }
//         return true;
//     }).then(function(response) {
//         return response;
//     }).catch(function(err) {
//         return false;
//     });
// }
// //check difference on click
// $('.check-diff').on('click', function() {
//     if ($(this).is(':checked') === true) {
//         diffModeFlag = true;
//         promise = isSameLanguage();
//         promise.then(function(response) {
//             if (response == false) {
//                 // $('.check-diff').p('checked', !($('.check-diff').is(':checked')));
//                 $('.check-diff').removeAttr('checked')
//                 alertModal("Error", "Compare mode is not meaningful across different languages. Please select the same language across all panes to continue.");
//                 // $('.check-diff').bootstrapSwitch('state', false);
//                 // $(".check-diff").removeClass('is-checked');
//                 $('#switchLable')[0].MaterialSwitch.off();
//                 return false;
//             } else {
//                 setDiffReferenceText();
//                 $(".verse-diff-on a").attr("disabled", "true").addClass("disable_a_href").css({ 'pointer-events': 'none' });
//                 $(".ref-drop-down").attr("disabled", "true");
//             }
//         });
//     } else {
//         diffModeFlag = false;
//         setReferenceTextBack();
//         $(".verse-diff-on a").removeAttr("disabled").removeClass("disable_a_href").css({ 'pointer-events': '' });;
//         $(".ref-drop-down").removeAttr("disabled", "true");
//     }
// });

// // call after stopped typing
// function debounce(targetCheck, func, wait, immediate) {
//     targetDirtyFlag = targetCheck;
//     var timeout;
//     return function() {
//         var context = this,
//             args = arguments;
//         var later = function() {
//             timeout = null;
//             if (!immediate) func.apply(context, args);
//         };
//         var callNow = immediate && !timeout;
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//         if (callNow) func.apply(context, args);
//     };
// };

// // This will apply the debounce effect on the keyup event
// // And it only fires 3000ms after the user stopped typing
// $('#input-verses').on('keyup', debounce(true, function() {
//     if (diffModeFlag == false) {
//         saveTarget();
//     }
// }, 3000));

// // call above function after stopped typing in the target pane end here
// $(".font-button").bind("click", function() {
//     var size = parseInt($('.col-ref').css("font-size"));
//     var numFontSize = parseInt($('.verse-num').css("font-size"));
//     if ($(this).hasClass("plus")) {
//         size = size + 2;
//         numFontSize = numFontSize + 1;
//         if (size >= 30) {
//             size = 30;
//         }
//         if(numFontSize >= 30){
//             numFontSize = 30
//         }
//     } else {
//         size = size - 2;
//         numFontSize = numFontSize -1 ;
//         if (size <= 14) {
//             size = 14;
//         }
//         if(numFontSize <= 10){
//             numFontSize = 10;
//         }
//     }
//     $("#fontSlider").slider('setValue', size);
//     $('.col-ref').css("font-size", size);
//     $('.verse-num').css("font-size", numFontSize);
// });

// function setAutoSaveTime(dateTime) {
//     const cookie = { url: 'http://autosave.autographa.com', name: 'autosave', value: dateTime };
//     session.defaultSession.cookies.set(cookie, (error) => {
//         if (error)
//             console.error(error);
//     });
// }

// session.defaultSession.cookies.get({ url: 'http://autosave.autographa.com' }, (error, cookie) => {
//     if (cookie.length > 0) {
//         $("#saved-time").html("Changes last saved on " + cookie[0].value);
//     }
// });

// // find and replace call here
// function findAndReplaceText(searchVal, replaceVal, option) {
//     session.defaultSession.cookies.get({ url: 'http://book.autographa.com' }, (error, cookie) => {
//         book = '1';
//         if (cookie.length > 0) {
//             book = cookie[0].value;
//         }
//     });
//     session.defaultSession.cookies.get({ url: 'http://chapter.autographa.com' }, (error, cookie) => {
//         if (cookie.length > 0) {
//             chapter = cookie[0].value;
//         }
//     });
//     db.get(book).then(function(doc) {
//         refDb.get('refChunks').then(function(chunkDoc) {
//             currentBook = doc;
//             if (option == "current") {
//                 var totalReplacedWord = findReplaceSearchInputs(doc.chapters[parseInt(chapter, 10) - 1].verses, chapter - 1, searchVal, replaceVal, option);
//                 allChapterReplaceCount.push(totalReplacedWord);
//                 var replacedCount = allChapterReplaceCount.reduce(function(a, b) {
//                     return a + b;
//                 }, 0);
//                 $("#searchTextModal").modal('toggle');
//                 $("#replace-message").html("Book:" + currentBook.book_name + "<br>" + "Total word(s) replaced: " + replacedCount);
//                 $("#replaced-text-change").modal('toggle');
//                 replaceCount = 0;
//                 allChapterReplaceCount = [];
//             } else {
//                 for (var i = 0; i < doc.chapters.length; i++) {
//                     var totalReplacedWord = findReplaceSearchInputs(doc.chapters[parseInt(i + 1, 10) - 1].verses, i, searchVal, replaceVal, option);
//                     allChapterReplaceCount.push(totalReplacedWord);
//                     totalReplacedWord = 0;
//                     replaceCount = 0;
//                 }
//                 $("#searchTextModal").modal('toggle');
//                 var replacedCount = allChapterReplaceCount.reduce(function(a, b) {
//                     return a + b;
//                 }, 0);
//                 $("#replace-message").html("Book:" + currentBook.book_name + "<br>" + "Total word(s) replaced: " + replacedCount);
//                 $("#replaced-text-change").modal('toggle');
//                 allChapterReplaceCount = [];
//             }
//         });
//     }).catch(function(err) {
//         console.log('Error: While retrieving document. ' + err);
//     });
// }
// // find and replace call end here

// // update replaced content
// function findReplaceSearchInputs(verses, chapter, searchVal, replaceVal, option) {
//     replacedVerse = {};
//     var i;
//     for (i = 1; i <= verses.length; i++) {
//         if (option == "current") {
//             var originalVerse = verses[i - 1].verse;
//             replacedVerse[i] = i;
//             if (originalVerse.search(new RegExp(escapeRegExp(searchVal), 'g')) >= 0) {
//                 modifiedVerse = originalVerse.replaceAll(searchVal, replaceVal);
//                 replacedVerse[i] = modifiedVerse;
//                 chapter_hash["verse"] = modifiedVerse;
//                 chapter_hash["verse_number"] = i + 1;
//                 verses_arr.push(chapter_hash);
//                 chapter_hash = {};
//                 replaceCount += originalVerse.match(new RegExp(escapeRegExp(searchVal), 'g')).length;
//             } else {
//                 replacedVerse[i] = originalVerse;
//                 chapter_hash["verse"] = originalVerse;
//                 chapter_hash["verse_number"] = i + 1;
//                 verses_arr.push(chapter_hash);
//                 chapter_hash = {};
//             }
//         } else {
//             var originalVerse = verses[i - 1].verse
//             replacedVerse[i] = i;
//             if (originalVerse.search(new RegExp(escapeRegExp(searchVal), 'g')) >= 0) {
//                 modifiedVerse = originalVerse.replaceAll(searchVal, replaceVal);
//                 chapter_hash["verse"] = modifiedVerse;
//                 chapter_hash["verse_number"] = i + 1;
//                 verses_arr.push(chapter_hash);
//                 chapter_hash = {};
//                 replaceCount += originalVerse.match(new RegExp(searchVal, 'g')).length;
//             } else {
//                 chapter_hash["verse"] = originalVerse;
//                 chapter_hash["verse_number"] = i + 1;
//                 verses_arr.push(chapter_hash);
//                 chapter_hash = {};
//             }
//         }
//     }
//     replacedChapter[chapter] = replacedVerse;
//     allChapters["chapter"] = chapter + 1;
//     allChapters["verses"] = verses_arr;
//     chapter_arr.push(allChapters);
//     verses_arr = [];
//     allChapters = {};
//     highlightRef();
//     return replaceCount;
// }
// // update replace content end here

// // save text after replace
// // by clicking on the save changes button 
// function saveReplacedText() {
//     var option = $("#chapter-option").val();
//     db.get(currentBook._id).then(function(doc) {
//         if (option == "current") {
//             for (var c in replacedChapter) {
//                 var verses = currentBook.chapters[parseInt(c, 10)].verses;
//                 verses.forEach(function(verse, index) {
//                     verse.verse = replacedChapter[c][index + 1];
//                 });
//                 doc.chapters[parseInt(c, 10)].verses = verses;
//                 db.put(doc, function(err, response) {
//                     if (err) {
//                         $("#replaced-text-change").modal('toggle');
//                         alertModal("Error", "Something went wrong. Try again.");
//                     } else {
//                         replaceCount = 0;
//                         window.location.reload();
//                     }
//                 });
//             }
//             replacedChapter = {};
//             replacedVerse = {};
//         } else {
//             doc.chapters = chapter_arr
//             db.put(doc, function(err, res) {
//                 if (err) {
//                     chapter_arr = [];
//                     $("#replaced-text-change").modal('toggle');
//                     alertModal("Error", "Something went wrong. Try again.");
//                 } else {
//                     chapter_arr = [];
//                     replacedChapter = {};
//                     replacedVerse = {};
//                     window.location.reload();
//                 }
//             })
//         }
//     })
// }

// // replace change end

// // find and replace popup call
// $("#btnfindReplace").click(function() {
//     $(".error").html("");
//     findVal = $("#searchTextBox").val();
//     replaceVal = $("#replaceTextBox").val();
//     option = $(".form-check-input:checked").val();
//     $("#chapter-option").val(option);
//     if (findVal == "" && findVal.length == 0) {
//         $("#findError").html("Please enter value to search");
//         return
//     }
//     if (replaceVal == "" && replaceVal.length == 0) {
//         $("#replaceError").html("Please enter value to replace");
//         return
//     }
//     findAndReplaceText(findVal, replaceVal, option);
// });

// $("#btnfind").click(function() {
//     findVal = $("#searchTextBox").val();
//     if (findVal == "" && findVal.length == 0) {
//         $("#searchTextModal").modal('toggle');
//         alertModal("Error", "Please enter text to search for.");
//         return
//     }
//     findAndReplaceText(findVal, "highlight");
//     $("#searchTextModal").modal('toggle');
// });

// $("#searchText").click(function() {
//     $("#searchTextModal").modal('toggle');
//     $(".error").html("");
//     $("#searchTextBox").val('');
//     $("#replaceTextBox").val('');
// });

// // replace cancel
// $("#replace-cancel").click(function() {
//     replacedChapter = {};
//     replacedVerse = {};
//     chapter_arr = [];
// });
// $(".navigation-btn").click(function() {
//     if (targetDirtyFlag == true) {
//         saveTarget();
//     }
// });


//     /*function saveTarget() {
//         var verses = currentBook.chapters[parseInt(chapter, 10) - 1].verses;
//         verses.forEach(function(verse, index) {
//             var vId = 'v' + (index + 1);
//             verse.verse = document.getElementById(vId).textContent;
//         });
//         currentBook.chapters[parseInt(chapter, 10) - 1].verses = verses;
//         db.get(currentBook._id).then(function(book) {
//             currentBook._rev = book._rev;
//             db.put(currentBook).then(function(response) {
//                 var dateTime = new Date();
//                 $("#saved-time").html("Changes last saved on " + formatDate(dateTime));
//                 setAutoSaveTime(formatDate(dateTime));
//                 clearInterval(intervalId);
//             }).catch(function(err) {
//                 db.put(currentBook).then(function(response) {
//                     var dateTime = new Date();
//                     $("#saved-time").html("Changes last saved on " + formatDate(dateTime));
//                     setAutoSaveTime(formatDate(dateTime));
//                 }).catch(function(err) {
//                     clearInterval(intervalId);
//                 });
//                 clearInterval(intervalId);
//             });
//         });
//     }*/
// // save last visit in database
// function saveLastVisit(book, chapter) {
//     refDb.get('ref_history').then(function(doc) {
//         doc.visit_history = [{ "book": $('#book-chapter-btn').text(), "chapter": chapter, "bookId": book }]
//         refDb.put(doc).then(function(response) {}).catch(function(err) {
//             console.log(err);
//         });
//     });
// }
// //save last visit end

// //font slider 
// $("#fontSlider").slider();
// $("#fontSlider").on("slide", function(slideEvt) {
//     $("#fontSliderSliderVal").text(slideEvt.value);
//     $('.col-ref').css("font-size", slideEvt.value);
//     $('.verse-num').css("font-size", slideEvt.value-4);
// });

// $("#fontSlider").on("slideStart", function(slideEvt) {
//     $("#fontSliderSliderVal").text(slideEvt.value);
//     $('.col-ref').css("font-size", slideEvt.value);
//     $('.verse-num').css("font-size", slideEvt.value-4);
// });

// //font slider

// //setting tab
// function settings(evt, settingsTab) {
//     var i, tabcontent, tablinks;
//     tabcontent = document.getElementsByClassName("tabcontent");
//     for (i = 0; i < tabcontent.length; i++) {
//         tabcontent[i].style.display = "none";
//     }
//     tablinks = document.getElementsByClassName("tablinks");
//     for (i = 0; i < tablinks.length; i++) {
//         tablinks[i].className = tablinks[i].className.replace(" active", "");
//     }
//     document.getElementById(settingsTab).style.display = "block";
//     evt.currentTarget.className += " active";
// }


// // Get the element with id="defaultOpen" and click on it
// document.getElementById("defaultOpen").click();

// // $(document).ready(function() {
// $(".selected ul li a").click(function() {
//     $(".selected ul li a").removeClass("link-active");
//     // $(".tab").addClass("active"); // instead of this do the below 
//     $(this).addClass("link-active");
// });
// // });

// //setting js


// document.getElementById('export-path').addEventListener('click', function(e) {
//     dialog.showOpenDialog({
//         properties: ['openDirectory'],
//         filters: [{ name: 'All Files', extensions: ['*'] }],
//         title: "Select export destination folder"
//     }, function(selectedDir) {
//         if (selectedDir != null) {
//             e.target.value = selectedDir;
//         }
//     });
// });

// document.getElementById('target-import-path').addEventListener('click', function(e) {
//     dialog.showOpenDialog({
//         properties: ['openDirectory'],
//         filters: [{ name: 'All Files', extensions: ['*'] }],
//         title: "Select import folder for target"
//     }, function(selectedDir) {
//         if (selectedDir != null) {
//             e.target.value = selectedDir;
//         }
//     });
// });

// document.getElementById('save-settings').addEventListener('click', function(e) {
//     if (target_setting() == false)
//         return;
//     db.get('targetBible').then(function(doc) {
//         db.put({
//             _id: 'targetBible',
//             _rev: doc._rev,
//             targetLang: document.getElementById('target-lang-code').value,
//             targetVersion: document.getElementById('target-version').value,
//             targetPath: document.getElementById('export-path').value
//         }).then(function(e) {
//             alert_message(".alert-success", "Saved translation details successfully.");
//         });
//     }).catch(function(err) {
//         db.put({
//             _id: 'targetBible',
//             targetLang: document.getElementById('target-lang-code').value,
//             targetVersion: document.getElementById('target-version').value,
//             targetPath: document.getElementById('export-path').value
//         }).then(function(e) {
//             alert_message(".alert-success", "Saved translation details successfully.");
//         }).catch(function(err) {
//             alert_message(".alert-danger", "Something went wrong. Try again.");
//         });
//     });
// });

// document.getElementById('ref-import-btn').addEventListener('click', function(e) {
//     if (reference_setting() == false)
//         return;
//     var ref_id_value = document.getElementById('langCode').value.toLowerCase() + '_' + document.getElementById('ref-version').value.toLowerCase(),
//         ref_entry = {},
//         files = fs.readdirSync(document.getElementById('ref-path').value);
//     ref_entry.ref_id = ref_id_value;
//     ref_entry.ref_name = document.getElementById('ref-name').value;
//     ref_entry.isDefault = false;
//     refDb.get('refs').then(function(doc) {
//         var refExistsFlag = false;
//         var updatedDoc = doc.ref_ids.forEach(function(ref_doc) {
//             if (ref_doc.ref_id === ref_id_value) {
//                 refExistsFlag = true;
//             }
//         });
//         if (!refExistsFlag) {
//             doc.ref_ids.push(ref_entry);
//             refDb.put(doc).then(function(res) {
//                 saveJsonToDB(files);
//                 buildReferenceList();
//                 alert_message(".alert-success", "Imported reference text successfully.");
//                 clearReferenceSetting();
//             });
//         } else {
//             saveJsonToDB(files);
//             buildReferenceList();
//             alert_message(".alert-success", "Imported reference text successfully.");
//             clearReferenceSetting();

//         }
//     }).catch(function(err) {
//         if (err.message === 'missing') {
//             var refs = {
//                 _id: 'refs',
//                 ref_ids: []
//             };
//             ref_entry.isDefault = true;
//             refs.ref_ids.push(ref_entry);
//             refDb.put(refs).then(function(res) {
//                 saveJsonToDB(files);
//                 buildReferenceList();
//                 alert_message(".alert-success", "Imported reference text successfully.");
//                 clearReferenceSetting();
//             }).catch(function(internalErr) {
//                 alert_message(".alert-danger", "There was an error while importing the USFM file.");
//             });
//         } else if (err.message === 'usfm parser error') {
//             alert_message(".alert-danger", "There was an error while parsing the USFM file.");
//         } else {
//             alert_message(".alert-danger", "There was an error while importing the USFM file.");
//         }
//     });
// });

// document.getElementById('target-import-btn').addEventListener('click', function(e) {
//     if (import_sync_setting() == false)
//         return;

//     var inputPath = document.getElementById('target-import-path').value;
//     var files = fs.readdirSync(inputPath);
//     files.forEach(function(file) {
//         var filePath = path.join(inputPath, file);
//         if (fs.statSync(filePath).isFile() && !file.startsWith('.')) {
//             //console.log(filePath);
//             var options = {
//                 lang: 'hi',
//                 version: 'ulb',
//                 usfmFile: filePath,
//                 targetDb: 'target'
//             }
//             bibUtil_to_json.toJson(options);
//         }
//     });
//     $("#importModal").modal('toggle');
// });

// $('#importModal').on('hidden.bs.modal', function () {
//     window.location.reload();
// })



// function saveJsonToDB(files) {
//     files.forEach(function(file) {
//         if (!file.startsWith('.')) {
//             var filePath = path.join(document.getElementById('ref-path').value, file);
//             //console.log(filePath + ' ' + fs.statSync(filePath).isFile());
//             if (fs.statSync(filePath).isFile()) {
//                 var options = {
//                     lang: document.getElementById('langCode').value.toLowerCase(),
//                     version: document.getElementById('ref-version').value.toLowerCase(),
//                     usfmFile: filePath,
//                     targetDb: 'refs'
//                 }
//                 bibUtil_to_json.toJson(options);
//             }
//         }
//     });
// }

// document.getElementById('ref-path').addEventListener('click', function(e) {
//     dialog.showOpenDialog({
//         properties: ['openDirectory'],
//         filters: [{ name: 'All Files', extensions: ['*'] }],
//         title: "Select reference version folder"
//     }, function(selectedDir) {
//         if (selectedDir != null) {
//             e.target.value = selectedDir;
//         }
//     });
// });



// // Validation check for reference settings
// function reference_setting() {
//     var name = $("#ref-name").val(),
//         langCode = $("#langCode").val(),
//         version = $("#ref-version").val(),
//         path = $("#ref-path").val(),
//         isValid = true;
//     if (name == "") {
//         alert_message(".alert-danger", "The Bible name is required.");
//         isValid = false;
//     } else if (langCode === null || langCode === "") {
//         alert_message(".alert-danger", "The Bible language code is required.");
//         isValid = false;
//     } else if (version === null || version === "") {
//         alert_message(".alert-danger", "The Bible version is required.");
//         isValid = false;
//     } else if (path === null || path === "") {
//         alert_message(".alert-danger", "The Bible path is required.");
//         isValid = false;
//     } else {
//         isValid = true;

//     }
//     return isValid;
// } //validation reference settings

// // Validation check for target language settings
// function target_setting() {
//     var langCode = $("#target-lang-code").val(),
//         version = $("#target-version").val(),
//         path = $("#export-path").val(),
//         isValid = true;

//     if (langCode === null || langCode === "") {
//         alert_message(".alert-danger", "Target Bible language code is required.");
//         isValid = false;
//     } else if (version === null || version === "") {
//         alert_message(".alert-danger", "Target Bible version is required.");
//         isValid = false;
//     } else if (path === null || path === "") {
//         alert_message(".alert-danger", "Target Bible path is required.");
//         isValid = false;
//     } else {
//         isValid = true;
//     }
//     return isValid;
// } //validation target setting

// function import_sync_setting() {
//     var targetImportPath = $("#target-import-path").val();
//     isValid = true;
//     if (targetImportPath === null || targetImportPath === "") {
//         alert_message(".alert-danger", "Import and Sync target must not be blank.");
//         isValid = false;
//     }
//     return isValid;
// }

// function alert_message(type, message) {
//     $(type).css("display", "block");
//     $(type).fadeTo(2000, 1000).slideUp(1000, function() {
//         $(type).css("display", "none");
//     });
//     $(type + " " + "span").html(message);
// }

// function setReferenceSetting() {
//     db.get('targetBible').then(function(doc) {
//         $("#target-lang-code").val(doc.targetLang);
//         $("#target-lang")[0].parentNode.MaterialTextfield.change(doc.targetLang);
//         $("#target-version")[0].parentNode.MaterialTextfield.change(doc.targetVersion);
//         $("#export-path")[0].parentNode.MaterialTextfield.change(doc.targetPath);
//     }).catch(function(err) {
//         $("#target-lang")[0].parentNode.MaterialTextfield.change("");
//         $("#target-version")[0].parentNode.MaterialTextfield.change("");
//         $("#export-path")[0].parentNode.MaterialTextfield.change("");
//     });
// }

// function alertModal(heading, formContent) {
//     $("#heading").html(heading);
//     $("#content").html(formContent);
//     $("#dynamicModal").modal();
//     $("#dynamicModal").toggle();
// }

// function matchCode(input) {
//     // var matches = []
//     var filteredResults = {};
//     return lookupsDb.allDocs({
//         startkey: input.toLowerCase(),
//         endkey: input.toLowerCase() + '\uffff',
//         include_docs: true
//     }).then(function(response) {
//         var data = ""
//         if (response != undefined && response.rows.length > 0) {
//             $.each(response.rows, function(index, value) {
//                     doc = value.doc
//                     if (doc) {
//                         //matches.push({ name: doc.name+' ('+doc.lang_code+') ' , id: doc._id });
//                         if (!filteredResults.hasOwnProperty(doc.lang_code)) {
//                             filteredResults[doc.lang_code] = doc.name; // 0 duplicates
//                         } else {
//                             existingValue = filteredResults[doc.lang_code]
//                             filteredResults[doc.lang_code] = (existingValue + " , " + doc.name);
//                         }
//                     }

//                 })
//                 // return matches;
//             return filteredResults
//         } else {
//             return [];
//         }
//     }).catch(function(err) {
//         console.log(err);
//     })
// }

// function changeInput(val, inputId, fieldValue, listId) {
//     codeClicked = false; // flag to check language code clicked on list or not
//     if (val.length >= 2) {
//         var autoCompleteResult = matchCode(val)
//         autoCompleteResult.then(function(res) {
//             var parent_ul = "<ul>";
//             if (res) {
//                 $.each(res, function(langCode, names) {
//                     // CREATE AND ADD SUB LIST ITEMS.
//                     parent_ul += "<li><span class='code-name'>" + names + ' (' + langCode + ') ' + "</span><input type='hidden' value=" + "'" + langCode + "'" + "class='code-id'/> </li>"
//                 });
//                 parent_ul += "</ul>"
//                 $(listId).html(parent_ul).show();
//                 $(listId + " li").on("click", function(e) {
//                     var $clicked = $(this);
//                     codeName = $clicked.children().select(".code-name").text();
//                     codeId = $clicked.find(".code-id");
//                     $(inputId).val(codeName);
//                     $(fieldValue).val(codeId.val());
//                     codeClicked = true;
//                 });
//             }
//         });
//     }else{
//         $(listId).hide();
//     }
//     $(document).on("click", function(e) {
//         var $clicked = $(e.target);
//         if (!$clicked.hasClass("search")) {
//             $(".lang-code").fadeOut();
//         }
//     });
//     $('#inputSearch').click(function() {
//         $(".lang-code").fadeIn();
//     });
// }
// $("#ref-lang-code").keyup(function() {
//     $("#langCode").val('');
//     changeInput($(this).val(), "#ref-lang-code", "#langCode", "#reference-lang-result");
// });

// $("#target-lang").keyup(function() {
//     $("#target-lang-code").val('');
//     changeInput($(this).val(), "#target-lang", "#target-lang-code", "#target-lang-result");
// });

// $('#ref-lang-code').on('blur', function() {
//     if (!codeClicked) {
//         $(this).val('') // clear language code textbox
//     }
// });
// $('#target-lang').on('blur', function() {
//     if (!codeClicked) {
//         $(this).val('') // clear language code textbox
//     }
// });

// function buildReferenceList() {
//     $("#reference-list").html('');
//     $(".ref-drop-down").html('');
//     refDb.get('refs').then(function(doc) {
//         tr = '';
//         var remove_link = '';
//         doc.ref_ids.forEach(function(ref_doc) {
//             var ref_id = ref_doc.ref_id
//             var ref_first = ref_id.substr(0, ref_id.indexOf('_'));
//             var ref_except_first =  ref_id.substr(ref_id.indexOf('_')+1);
//             tr += "<tr><td>";
//             tr += ref_doc.ref_name;
//             tr += "</td>";
//             tr += "<td>"+ref_first+"</td>"
//             tr += "<td>"+ref_except_first+"</td>"
//             if (constants.defaultReferences.indexOf(ref_doc.ref_id) >= 0) {
//                 tr += "<td></td>";
//             } else {
//                 tr += "<td><a data-id=" + ref_doc.ref_id + " href=javaScript:void(0); class='edit-ref'>Rename</a> | <a data-id=" + ref_doc.ref_id + " href=javaScript:void(0) class='remove-ref'>Remove</a></td>";
//             }
//             tr += "</tr>";
//             var ref_name = ref_first.toUpperCase()+"-"+ref_except_first;
//             $('<option></option>').val(ref_doc.ref_id).text(ref_name).appendTo(".ref-drop-down");
//         });
//         $("#reference-list").html(tr);
//     })
// }
// $(document).on('click', '.edit-ref', function() {
//     var tdElement = $(this).parent().parent().children(':first-child');
//     var temp_text = tdElement.text();
//     var docId = $(this).data('id');
//     $(this).css('pointer-events', 'none');
//     tdElement.html('<input type="text"  class="ref-text" value="' + tdElement.text() + '" maxlength="25" />&nbsp;<a data-docid=' + docId + ' class="save-ref-text" href="javaScript:void(0)">Save</a> | <a data-temp = ' + temp_text + ' class="cancel-ref" href="javaScript:void(0)">Cancel</a>');
// });
// $(document).on('click', '.cancel-ref', function() {
//     var tdElement = $(this).parent().parent().children(':first-child');
//     tdElement.html($(this).data('temp'));
//     tdElement.parent().children(':last-child').find('.edit-ref').css('pointer-events', '');
// });
// $(document).on('click', '.remove-ref', function() {
//     var element = $(this);
//     removeReferenceLink = element;
//     var modal = $("#confirmModal");
//     modal.modal("show");
//     $("#confirmMessage").html("Are you sure you want to delete this reference text?");
// });
// $("#confirmOk").click(function() {
//     removeRef(removeReferenceLink);
// });

// function removeRef(element) {
//     var ref_ids = [];
//     refDb.get('refs').then(function(doc) {
//         doc.ref_ids.forEach(function(ref_doc) {
//             if (ref_doc.ref_id != element.data('id')) {
//                 ref_ids.push({ ref_id: ref_doc.ref_id, ref_name: ref_doc.ref_name, isDefault: ref_doc.isDefault });
//             }
//         })
//         doc.ref_ids = ref_ids;
//         return refDb.put(doc);
//     }).then(function(res) {
//         element.closest('tr').remove();
//         buildReferenceList();
//         $("#confirmModal").modal("hide");
//     }).catch(function(err) {
//         $("#confirmModal").modal("hide");
//         alertModal("Remove Info", "Unable to delete. Try again.");
//     })
// }
// $(document).on('click', '.save-ref-text', function() {
//     var textElement = $(this).prev();
//     var docId = $(this).data('docid');
//     var tdElement = $(this).parent();
//     var result = false;
//     if (textElement.val() === '') {
//         alertModal("Alert", "Reference name is required.");
//         return;
//     }
//     var ref_ids = [];
//     refDb.get('refs').then(function(doc) {
//         doc.ref_ids.forEach(function(ref_doc) {
//             if ((ref_doc.ref_id != docId) && (ref_doc.ref_name.toLowerCase() === textElement.val().toLowerCase())) {
//                 result = true;
//                 return
//             }
//             if (ref_doc.ref_id != docId) {
//                 ref_ids.push({ ref_id: ref_doc.ref_id, ref_name: ref_doc.ref_name, isDefault: ref_doc.isDefault });
//             } else {
//                 ref_ids.push({ ref_id: ref_doc.ref_id, ref_name: textElement.val(), isDefault: ref_doc.isDefault })
//             }
//         })
//         if (result == true) {
//             return true;
//         } else {
//             doc.ref_ids = ref_ids;
//             return refDb.put(doc);
//         }
//     }).then(function(res) {
//         if (res == true) {
//             alertModal("Update Info", "That name is already taken. Try a different name.");
//         } else {
//             tdElement.html(textElement.val());
//             tdElement.next().find('.edit-ref').css('pointer-events', '');
//         }
//     }).catch(function(err) {
//         alertModal("Update Info", "Unable to re-name. Try again.");
//     })
// });

// function clearReferenceSetting() {
//     $('#langCode').val('');
//     $('#ref-name').val('');
//     $('#ref-path').val('');
//     $('#ref-version').val('');
//     $("#ref-lang-code").val('');
// }
// $("#btnSettings").click(function() {
//     $('#bannerformmodal').modal('toggle')
// })
// $("#btnAbout").click(function() {
//     $('#aboutmodal').modal('toggle')
// })
// $(document).on('show.bs.modal', '#bannerformmodal', function() {
//     setReferenceSetting();
//     buildReferenceList();
// });

// $(document).ready(function(){
// $("#books-pane ul").click(function() {
//     session.defaultSession.cookies.get({ url: 'http://chapter.autographa.com' }, (error, cookie) => {
//         if (cookie.length > 0) {
//             chapter = cookie[0].value;
//             $("#c"+chapter).addClass("link-active");
//         } else {
            
//         }
//     });
// });
// });
// function escapeRegExp(str) {
//   return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
// }
// function formatDate(date) {
//   var monthNames = [
//     "Jan", "Feb", "Mar",
//     "Apr", "May", "June", "July",
//     "Aug", "Sep", "Oct",
//     "Nov", "Dec"
//   ];

//   var day = date.getDate();
//   var monthIndex = date.getMonth();
//   var year = date.getFullYear();
//   var hours = date.getHours();
//   var seconds = date.getSeconds();
//   var minutes = date.getMinutes();
//   var ampm = hours >= 12 ? 'pm' : 'am';
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   minutes = minutes < 10 ? '0'+minutes : minutes;
//   var strTime = hours + ':' + minutes + ' ' + ampm;

//   return day + '-' + monthNames[monthIndex] + '-' + year+' at '+hours+ ':' + minutes + ':' + seconds +' '+ ampm
// }
