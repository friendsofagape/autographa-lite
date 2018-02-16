const electron = require('electron');
const session = require('electron').session;
if(require('electron-squirrel-startup')) return;

// Module to control application life.
const {app} = electron
// Module to create native browser window.
const {BrowserWindow} = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
    icon:'/app/assets/images/logo.png',
    width: 800,
    height: 600,
    // 'min-width': 600,
    // 'min-height': 300,
    // 'accept-first-mouse': true,
    // 'title-bar-style': 'hidden',
    // 'webPreferences': {'session': session}
    });

    // and load the index.html of the app.
    win.loadURL(`file:${__dirname}/app/views/index.html`);

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
	// Setup database.
	var dbUtil = require(`${__dirname}/app/util/DbUtil.js`);
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
});

