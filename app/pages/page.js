// const React = require('react')
// const ReactDOM = require('react-dom')
// const Footer = require('../components/footer.js')
// const NavBar = require('../components/navbar.js')
// const Contentbox = require('../components/contentbox')
// // const darkBaseTheme = require('material-ui/styles/baseThemes/darkBaseTheme')
// // const MuiThemeProvider = require ('material-ui/styles/MuiThemeProvider')
// // const getMuiTheme = require('material-ui/styles/getMuiTheme')
import React from 'react';
import  NavBar  from '../components/Navbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { IntlProvider, addLocaleData } from 'react-intl';
import { observer } from "mobx-react";
import TodoStore from "../components/TodoStore";
const i18n = new(require('../../translations/i18n'));
const refDb = require("../util/data-provider").referenceDb();

// addLocaleData([...en, ...es, ...fr, ...it]);

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage;

const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

// Try full locale, try locale without region code, fallback to 'en'
// const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

@observer
class Page extends React.Component {

	constructor(){
		super()
	    this.state = {appLang: ''}
	    i18n.getLocale().then((lang) => {
			TodoStore.appLang = lang;
	    });
	    i18n.currentLocale().then((res) =>{
	    	TodoStore.currrentTrans = res;
	    })
	}

	render(){
		if (!TodoStore.appLang && TodoStore.currentTrans && Object.keys(TodoStore.currrentTrans).length === 0) {
			return null;
		}
	    return (
	    	<IntlProvider locale={TodoStore.appLang} messages={TodoStore.currrentTrans} >
			    <MuiThemeProvider>
			    	<NavBar /> 
			    </ MuiThemeProvider>
	     	</IntlProvider>
	    )
	} 
};

module.exports = Page

