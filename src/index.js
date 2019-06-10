import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';
require("./assets/stylesheets/style.css")
require("./assets/stylesheets/bootstrap-slider.css")
require("./assets/stylesheets/material.light_blue-indigo.min.css")
require("./assets/stylesheets/icon.css")
const Page = require('./pages/page.js');

ReactDOM.render(<Page />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
