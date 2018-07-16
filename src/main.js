const electron = require('electron');
const session = require('electron').session;

const {autoUpdater} = require("electron-auto-updater");
const { CancellationToken } = require("electron-builder-http");
const cancellationToken = new CancellationToken()
autoUpdater.autoDownload = false;

// Module to control application life.
const {app} = electron
// Module to create native browser window.
const {BrowserWindow, ipcMain, dialog} = electron;
import path from "path";
import url from "url";
import env from "env";

const fs = require('fs');
const mkdirp = require('mkdirp');
const dir = path.join(app.getPath('temp'), '..', 'Autographa');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
console.log(path.resolve(__dirname))
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
	win.webContents.openDevTools();	
    // autoUpdater.checkForUpdates();

	win.maximize();
        win.show();
    });

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win.refDb.close();
        win.targetDb.close();
        win.lookupsDb.close();
        if(fs.existsSync('db')){
            copyFolderRecursiveSync('db', app.getPath('userData'));
            var ds = (new Date()).toISOString().replace(/[^0-9]/g, "");
            copyFolderRecursiveSync('db', path.join(app.getPath('userData'), "DB_backups", "db_backup_"+ds));
        }
	   win = null;
    	if (process.platform !== 'darwin') {
    	    app.quit();
    	}
    });
}

let getLatestRelease = () => {
  const versionsDesc = fs.readdirSync(dir).filter((file) => {
    if(file.startsWith("app-")){
      const filePath = path.join(dir, file);
      return fs.statSync(filePath).isDirectory();
    }
  }).reverse();
  return versionsDesc[0];
}

function deleteFile(dir, file) {
    return new Promise(function (resolve, reject) {
        var filePath = path.join(dir, file);
        fs.lstat(filePath, function (err, stats) {
            if (err) {
                return reject(err);
            }
            if (stats.isDirectory()) {
                resolve(deleteDirectory(filePath));
            } else {
                fs.unlink(filePath, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }
        });
    });
};

// var dbSetup = new Promise(
//     function (resolve, reject) {
// 	// Setup database.
// 	var dbUtil = require(`${__dirname}/util/DbUtil.js`);
// 	dbUtil.setupTargetDb
// 	    .then((response) => {
// 		console.log(response);
// 		return dbUtil.setupRefDb;
// 	    })
// 	    .then((response) => {
// 		console.log(response);
//         return dbUtil.setupLookupsDb;
// 	    })
//         .then((response)=>{
//             console.log(response)
//             resolve(response)
//         })
//         .catch((err) => {
// 		console.log('Error while DB setup. ' + err);
// 		reject(err);
// 	    });
//     });

// function preProcess() {
//     dbSetup
// 	.then((response) => {
// 	    createWindow();
// 	})
// 	.catch((err) => {
// 	    console.log('Error while App intialization.' + err);
// 	});
// }
function deleteDirectory(dir) {
    return new Promise(function (resolve, reject) {
        fs.access(dir, function (err) {
            if (err) {
                return reject(err);
            }
            fs.readdir(dir, function (err, files) {
                if (err) {
                    return reject(err);
                }
                Promise.all(files.map(function (file) {
                    return deleteFile(dir, file);
                })).then(function () {
                    fs.rmdir(dir, function (err) {
                        if (err) {
                          console.log(err)
                            return reject(err);
                        }
                        resolve();
                    });
                }).catch(reject);
            });
        });
    });
};

function preProcess() {
    return new Promise(
    function (resolve, reject) {
    
        // If DB does not exist in the application dir
        if(!fs.existsSync('db')){ 
            if(fs.existsSync(path.join(app.getPath('userData'), 'db'))){
                copyFolderRecursiveSync(path.join(app.getPath('userData'), 'db'),  path.resolve(path.join(`${__dirname}`, '../../../' )));
                resolve("db copied");
                return
            }else{
                resolve('new installation');
                return;
            }

        }else{
          resolve("db already exist");
        }
       
    })
     .then((response) => {
         //return dbSetup;
    return new Promise(
        function (resolve, reject) {
        // Setup database.
        const dbUtil = require(`${__dirname}/util/DbUtil.js`);
        dbUtil.setupTargetDb
            .then((response) => {
              return dbUtil.setupRefDb;
            })
            .then((response) => {
              resolve(response);
            }).then((response) => {
              return dbUtil.setupLookupsDb;
            })
            .then((response)=>{
                resolve(response)
            })
            .catch((err) => {
              console.log('Error while DB setup. ' + err);
              reject(err);
            });
        });
     })
     .then((response) => {
            if (fs.existsSync(dir)){
              fs.readdirSync(dir).filter((file) => {
                  if(file.startsWith("app-") && file != getLatestRelease()){
                    const filePath = path.join(dir, file);
                    deleteDirectory(filePath).then(function(res){
                      console.log(res)
                    }).catch(function(err){
                      console.log(err);
                    })
                  }
              });
            }
            createWindow();
            win.refDb = require(`${__dirname}/util/data-provider`).referenceDb();
            win.targetDb =  require(`${__dirname}/util/data-provider`).targetDb();
            win.lookupsDb = require(`${__dirname}/util/data-provider`).lookupsDb();
            // autoUpdaterOptions = {refDb: win.refDb, updateDownloaded: false}
            // autoUpdater.initialize(autoUpdaterOptions);
     })
     .catch((err) => {
         console.log('Error while App initialization.' + err);
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



autoUpdater.on('update-available', (info) => {
    const buttons = ['Update', 'Later'];
    dialog.showMessageBox(win, { type: 'info', buttons: buttons, message: "A new update is ready to install. \n" + "Version  is downloaded and will be automatically installed on restart", title: "Update" }, function (buttonIndex) {
      if (buttonIndex == 0) {
        win.webContents.send('downloading-update');
        autoUpdater.downloadUpdate(cancellationToken);
        return false;
      }else{
        win.webContents.send('update-cancel');
      }
    });
   
});
// when the update is ready, notify the BrowserWindow
//path for local db path.join(`${__dirname}`, '..', 'db')
autoUpdater.on('update-downloaded', (info) => {
    win.setProgressBar(0);
    const buttons = ['Restart'];
    dialog.showMessageBox(win, { type: 'info', buttons: buttons, message: "A new update  is downloaded and will be automatically installed on restart", title: "Update" }, function (buttonIndex) {
      if (buttonIndex == 0) {
        win.refDb.close();
        win.targetDb.close();
        win.lookupsDb.close();
        copyFolderRecursiveSync(path.join(app.getPath('userData'), 'db'),  path.resolve(path.join(`${__dirname}`, '../../../' )));
        autoUpdater.quitAndInstall();
        return false;
      }
    });
    win.webContents.send('updateReady')
});

ipcMain.on("update-application", (event, arg) => {
    autoUpdater.downloadUpdate(cancellationToken);
});

// app.on('ready', function() {
//   createDefaultWindow();
//   autoUpdater.checkForUpdates();
// });

ipcMain.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall();
});

ipcMain.on("checkForUpdates", (event, arg) => {
    autoUpdater.checkForUpdates();
});


autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = parseInt(progressObj.percent) + '%';
  // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  win.webContents.send('message', log_message);
  win.setProgressBar(progressObj.percent);

});

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

function copyFileSync( source, target ) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    if ( !fs.existsSync( target ) ) {
        fs.mkdirSync( target );
    }
    //check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        mkdirp.sync( targetFolder );
    }
    if(!fs.existsSync(path.join(app.getPath('userData'), 'DB_backups'))){
      mkdirp.sync(path.join(app.getPath('userData'), "DB_backups"))
    }

    //copy
    if ( fs.existsSync( source ) && fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
            return
        } );
    }
}


