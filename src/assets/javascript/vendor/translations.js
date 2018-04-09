var elementsList = [{".verse-diff-on #label-on" : 'btn-switch-on'}, {".verse-diff-on #label-off" : 'btn-switch-off'}, {'.translation': 'label-translation'}, {'#defaultOpen': 'label-translation-details'}, 
{'#label-import-translation': 'label-import-translation' }, {"#label-import-ref-text": "label-import-ref-text"}, 
{"#label-manage-ref-texts": "label-manage-ref-texts"}, {".label-language-code": "label-language-code" }, 
{".label-version": "label-version"}, {"#label-export-folder-location": "label-export-folder-location"},
{".label-folder-location": "label-folder-location"}, {"#label-bible-name": "label-bible-name"}, 
{"#label-book-chapter": "label-book-chapter"}, {".btn-save":'btn-save'},{".btn-import":'btn-import'},
{"#exportUsfm":'btn-export'},{"#btn-ok":'btn-ok'},{"#btnfindReplace":'btn-replace'},
{"#btn-save-changes":'btn-save-changes'},{"#tbl-header-name":'tbl-header-name'},
{"#tbl-header-action":'tbl-header-action'},{"#modal-title-setting":'modal-title-setting'},
{"#label-find-replace":'label-find-replace'},{"#label-current-chapter":'label-current-chapter'},
{"#label-current-book":'label-current-book'},{"#label-find":'label-find'},
{"#label-replace-with":'label-replace-with'},{"#export-heading":'tooltip-export-usfm'},
{"#replace-information":'label-replaced-information'},{"#replace-cancel":'btn-cancel'},{"#confirmCancel" : 'btn-cancel'}, {"#confirmOk": "btn-ok"},
{"#modal-title-about":'modal-title-about'},{"#overviewtab":'label-overview-tab'},
{"#licensetab":'label-license-tab'},{"#booksTab":'label-books-tab'},{"#chapterTab":'label-chapter-tab'},
{"#allBooksBtn":'btn-all'},{"#otBooksBtn":'btn-ot'}, {"#ntBooksBtn":'btn-nt'},
{"#app-name":'app-name-Autographa-Lite'},{"#label-hosted-url":'label-hosted-url'},{".stage":'label-stage'}, {"#label-language": "label-language"}, {"#language-select": "label-select-language"}, {"#label-auto-update-info" : "label-auto-update-info"}, {"#label-auto-update" : "label-auto-update"}, {"#label-radio-enable": "label-radio-enable"}, {"#label-radio-disable": "label-radio-disable"}, {"#export-usfm": "export-usfm"}, {"#export-html-1-column": "export-html-1-column"}, {"#export-html-2-column": "export-html-2-column"}, {".label-script-dir": "label-script-direction"}, {".label-ltr": "label-ltr"}, {".label-rtl": "label-rtl"}, {"#heading-confirmation" : "label-heading-confirmation"}, {".loading": "label-please-wait"}]

var elementsTitleList = {'placeholder': [{"#searchTextBox":'placeholder-search-text'},{"#replaceTextBox":'placeholder-replace-text'},{"#export-path":'placeholder-path-to-destination'},{".import":'placeholder-path-of-usfm-files'},{"#ref-name":'placeholder-eng-translation'},{"#stageText":'placeholder-stage-trans'}], 'title': [{"#book-chapter-btn":'tooltip-select-book'},{"#chapterBtn":'tooltip-select-chapter'},{"#switchLable":'tooltip-compare-mode'},{"#searchText":'tooltip-find-and-replace'},{"#btnfindReplace":'tooltip-run-find-and-replace'},{"#btnAbout":'tooltip-about'},{"#btnSettings":'tooltip-settings'},{".minus":'tooltip-minus-font-size'},{".plus":'tooltip-plus-font-size'},{"#2-column-layout":'tooltip-2-column'},{"#3-column-layout":'tooltip-3-column'},{"#4-column-layout":'tooltip-4-column'},{"#save-btn":'tooltip-btn-save'},{".close":'tooltip-modal-close'},{".ref-drop-down":'tooltip-select-reference-text'},{"#allBooksBtn":'tooltip-all'},{"#otBooksBtn":'tooltip-old-testament'},{"#ntBooksBtn":'tooltip-new-testament'}, {"#export-usfm":'tooltip-export-usfm'}, {"#print-pdf":'tooltip-export-html'}], "data-tip": [{".lang-code-selection": "tooltip-language-validation"}], "data-tip-rtl": [{".lang-code-selection": "tooltip-language-validation"}] }


window.localization = window.localization || {},
    function(n) {
        localization.translate = {
            setLanguageText: function(id, phrase){
                $.each(elementsList, function(index, object){
                     for (var o in object) {
                        if (object.hasOwnProperty(o)) {
                            i18n.__(object[o]).then((trans) => $(o).text(trans))
                            
                        }
                    }
                })
            },
            setLanguageTitleAttr: function(id, phrase){
                $.each(elementsTitleList, function(key, object){
                    $.each(object, function(index, titleObj){
                         for (var tobj in titleObj) {
                            if (titleObj.hasOwnProperty(tobj)) {
                                i18n.__(titleObj[tobj]).then((trans) => $(tobj).attr(key, trans).tooltip('fixTitle').tooltip('setContent'))
                            }
                        }
                    })  
                })
            },
            init: function() {
                i18n.__('app-name-Autographa-Lite').then((trans)=> $(document).find("title").text(trans));
                this.setLanguageText();
                this.setLanguageTitleAttr();

            }
        };
        n(function() {
            localization.translate.init();
        })

}(jQuery);
