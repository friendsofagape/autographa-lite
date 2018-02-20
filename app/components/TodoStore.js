import { computed, observable } from "mobx"
const session =  require('electron').remote.session
const Constant = require("../util/constants");

export class TodoStore {
  @observable bookId = '1'
  @observable chapterId = '1'
  @observable refId = 'eng_ulb'
  @observable refId1 = 'eng_ulb'
  @observable refId2 = 'eng_ulb'
  @observable bookChapter = { bookId: 0, chapterLength: 0 }
  @observable activeTab = 1
  @observable showModalBooks = false
  @observable showModalSettings = false
  @observable showModalAboutUs = false
  @observable showModalSearch = false
  @observable showModalDownload = false
  @observable bookChapterContent = ''
  @observable chunkGroup = ''
  @observable content = ''
  @observable contentOne =''
  @observable contentTwo =''
  @observable contentCommon =''
  // @observable contentThree =''
  @observable bookActive = 1;
  @observable chapterActive = 1
  @observable currentRef = 'eng_ulb'
  @observable bookData = Constant.booksList
  @observable bookName = ''
  @observable translationContent =  ''
  @observable selectId =  1
  @observable chunks = ''
  @observable verses = ''
  // @observable step = 1
  // @observable max = 40
  // @observable min = 14
  @observable fontStep = 1
  @observable fontMax = 40
  @observable fontMin = 14
  @observable currentFontValue = 14
  @observable layout = 1
  @observable layoutContent = 1
  @observable layout3xDirect = true
  @observable layout2xDirect = true
  @observable searchValue = ''
  @observable replaceValue = ''
  // @observable currentValue = 14
  @observable fontSize = 14
  @observable aId =''
  @observable appLang = ''
  @observable currentTrans = ''
  @observable scriptDirection = "ltr"
  constructor(bookId, chapterId, bookChapter, activeTab, showModalBooks, bookChapterContent, chunkGroup, content, currentRef, booksList, selectId){

  }  
}
export default new TodoStore