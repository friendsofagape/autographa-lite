import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';

// Our translated strings


const Page = require('./app/pages/page.js');

render( <Page /> , document.getElementById('container'));
