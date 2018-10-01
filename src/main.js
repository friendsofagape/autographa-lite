const electron = require('electron');
const session = require('electron').session;

// Module to control application life.
const {app} = electron
// Module to create native browser window.
const {BrowserWindow} = electron;
import path from 'path';
import url from 'url';
import env from 'env';

import {existsSync, mkdirSync} from 'fs'


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
    icon:'/assets/images/logo.png',
    width: 800,
    height: 600,
     height: 600,
    'min-width': 600,
    'min-height': 300,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden',
    'webPreferences': {'session': session},
    show: false
    });
    if (env.name === "development") {
        //win.openDevTools();
    }
    
    // and load the index.html of the app.
    // win.loadURL(`file:${__dirname}/views/index.html`);
    win.setMenu(null);
    // win.loadURL(url.format({
    // protocol: 'file:',
    // pathname: path.join(__dirname, '/views/index.html'),
    // slashes:  true}))
    win.loadURL(
         url.format({
      pathname: path.join(__dirname, "/views/index.html"),
      protocol: "file:",
      slashes: true
    })
    )

    //loading window gracefully
    win.once('ready-to-show', () => {
	// Open the DevTools.
	//win.webContents.openDevTools();	
	win.maximize();
        win.show();
    });

    // Emitted when the window is closed.
    win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
	win = null;
	if (process.platform !== 'darwin') {
	    app.quit();
	}
    });
}

var dbSetup = new Promise(
  function (resolve, reject) {
    if ( !existsSync('db') ) {
      mkdirSync( 'db' );
    }
	// Setup database.
	var dbUtil = require(`${__dirname}/util/DbUtil.js`);
	dbUtil.setupTargetDb
	    .then((response) => {
		console.log(response);
		return dbUtil.setupRefDb;
	    })
	    .then((response) => {
		console.log(response);
        return dbUtil.setupLookupsDb;
	    })
        .then((response)=>{
            console.log(response)
            resolve(response)
        })
        .catch((err) => {
		console.log('Error while DB setup. ' + err);
		reject(err);
	    });
    });

function preProcess() {
    dbSetup
	.then((response) => {
	    createWindow();
	})
	.catch((err) => {
	    console.log('Error while App intialization.' + err);
	});
}

// if (env.name === "development") {
//     win.openDevTools();
//   }
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', preProcess);


// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
    app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
    createWindow();
    }
    // win.openDevTools();
    
});

//code for sigle instance at a time according to electron 3.0.0
// app.requestSingleInstanceLock();
// app.on('second-instance', (commandLine, workingDirectory) => {
//     // Someone tried to run a second instance, we should focus our window.
//     if (win) {
//         if (win.isMinimized()) win.restore()
//         win.focus()
//     }
// })

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

if (isSecondInstance) {
    app.quit()
}





