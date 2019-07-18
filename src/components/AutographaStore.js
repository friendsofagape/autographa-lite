import { observable } from "mobx"
const Constant = require("../util/constants");

export class AutographaStore {
  @observable bookId = '1'
  @observable chapterId = '1'
  @observable bookChapter = { bookId: 0, chapterLength: 0 }
  @observable activeTab = 1
  @observable showModalBooks = false
  @observable showModalSettings = false
  @observable showModalAboutUs = false
  @observable showModalSearch = false
  @observable showModalDownload = false
  @observable  showModalStat = false
  @observable bookChapterContent = ''
  @observable chunkGroup = ''
  @observable content = ''
  @observable contentOne =''
  @observable contentTwo =''
  @observable contentCommon =''
  // @observable contentThree =''
  @observable bookActive = 1;
  @observable chapterActive = 1
  @observable currentRef = 'eng_ult'
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
  @observable appLang = 'en'
  @observable currentTrans = {}
  @observable scriptDirection = "LTR"
  @observable refScriptDirection = "LTR"
  @observable refList = []
  @observable refListEdit = []
  @observable refListExist = []
  @observable activeRefs = {0: "eng_ult", 1: "eng_ult", 2: "eng_ult"}
  @observable transSaveTime = ""
  @observable replaceOption = "chapter"
  @observable toggle = false
  @observable tIns = []
  @observable tDel = []
  @observable emptyChapter = []
  @observable incompleteVerse = {}
  @observable multipleSpaces = {}
  @observable setDiff = false
  @observable backupOption = "current"
  @observable successFile = []
  @observable errorFile = []
  @observable warningMsg = []

  constructor(bookId, chapterId, bookChapter, activeTab, showModalBooks, bookChapterContent, chunkGroup, content, currentRef, booksList, selectId){

  }  
}
export default new AutographaStore()