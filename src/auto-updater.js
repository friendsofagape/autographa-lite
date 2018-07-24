const fs = require('fs');
const path = require('path');
const electron = require('electron');
const {app} = electron;

module.exports = function(win, dialog, autoUpdater, ipcMain, currentTrans, cancellationToken){

const loadedLanguage = win.refDb.get('app_locale').then(function(doc) {
        if(fs.existsSync(path.join(__dirname, 'translations', doc.appLang + '.js'))) {
            return JSON.parse(fs.readFileSync(path.join(__dirname,  'translations',  doc.appLang + '.js'), 'utf8'))
        }
        else {
            return JSON.parse(fs.readFileSync(path.join(__dirname, 'translations', 'en.js'), 'utf8'))
        }
    }).catch(function(error){
        return JSON.parse(fs.readFileSync(path.join(__dirname, 'translations', 'en.js'), 'utf8'))
});

ipcMain.on("update-application", (event, arg) => {
    autoUpdater.downloadUpdate(cancellationToken);
});

ipcMain.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall();
});

ipcMain.on("checkForUpdates", (event, arg) => {
    autoUpdater.checkForUpdates();
});

autoUpdater.on('update-available', (info) => {
    loadedLanguage.then((res) => {
        const buttons = [res[0]["label-download"], res[0]["btn-cancel"]];
        dialog.showMessageBox(win, { type: 'info', buttons: buttons, message: res[0]["label-auto-update-available"], title: res[0]["label-auto-update-available-title"] }, function (buttonIndex) {
          if (buttonIndex == 0) {
            autoUpdater.downloadUpdate(cancellationToken);
            win.webContents.send('downloading-update');
            return false;
          }else{
            win.webContents.send('update-cancel');
          }
        });
    });
});
autoUpdater.on('error', (infor) => {
    loadedLanguage.then((res) => {
        const buttons = [res[0]["btn-ok"]];
        dialog.showMessageBox(win, { type: 'info', buttons: buttons, message: res[0]["dynamic-msg-went-wrong"], title: res[0]["update-error-title"] }, function (buttonIndex) {
            win.webContents.send('update-cancel');
        });
    });
    
})

autoUpdater.on('update-not-available', (info) => {
    loadedLanguage.then((res) => {
        const buttons = [res[0]["btn-ok"]];
        dialog.showMessageBox(win, { type: 'info', buttons: buttons, message: res[0]["update-unavailable-msg"], title: res[0]["update-unavailable-title"] }, function (buttonIndex) {
            win.webContents.send('update-cancel');
        });
    })
});
// when the update is ready, notify the BrowserWindow
//path for local db path.join(`${__dirname}`, '..', 'db')
autoUpdater.on('update-downloaded', (info) => {
    win.setProgressBar(0);
    loadedLanguage.then((res) => {
        const buttons = [res[0]["label-install-restart"], res[0]["btn-cancel"]];
        dialog.showMessageBox(win, { type: 'info', buttons: buttons, message: res[0]["label-update-downloaded"], title: res[0]["label-install-updates"] }, function (buttonIndex) {
          if (buttonIndex == 0) {
            win.updateDownloaded = true;
            win.refDb.get("autoupdate").then((doc) =>{
                doc.enable = false;
                win.refDb.put(doc);
            }, (err) => {win.updateDownloaded = false;})
            win.refDb.close();
            win.targetDb.close();
            win.lookupsDb.close();
            copyFolderRecursiveSync(path.join(app.getPath('userData'), 'db'),  path.resolve(path.join(`${__dirname}`, '../../../' )));
            autoUpdater.quitAndInstall();
          }else{
            win.refDb.get("autoupdate").then((doc) =>{
                win.updateDownloaded = true;
                doc.updateDownloaded = true;
                doc.currentAppVersion = app.getVersion();
                win.autoupdateEnable = false;
                doc.enable = false;
                win.refDb.put(doc);
            }, (err) => {win.updateDownloaded = false;})
            win.webContents.send('update-downloaded'); 
          }
        });
    });
});
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = parseInt(progressObj.percent) + '%';
  // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  win.webContents.send('message', log_message);
  win.setProgressBar(progressObj.percent);

});

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
      // mkdirp.sync(path.join(app.getPath('userData'), "DB_backups"))
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

}

