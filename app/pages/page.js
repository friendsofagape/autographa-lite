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



class Page extends React.Component {
  
render(){
    return (
    <MuiThemeProvider>
     	<NavBar /> 
     </ MuiThemeProvider>
    )
  } 
};

module.exports = Page

