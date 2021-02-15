// const { shell } = require("electron");
const electron = require("electron");
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;
//const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs');
const { dir } = require("console");
// let shell = electron.shell;
// const dialog  = electron.dialog; 
const {shell,dialog, BrowserWindow,app, Menu, ipcMain} = electron;

// shell.openExternal(__dirname)

// const dialog = electron.dialog;
// console.log(document.querySelector("#selectBtn"));
// document.querySelector('#selectBtn').addEventListener('click', function (event) {
//     dialog.showOpenDialog({
//         properties: ['openFile', 'multiSelections']
//     }, function (files) {
//         if (files !== undefined) {
//             // handle files
//         }
//     });
// });
// shell.openExternal(__dirname)
// const {shell} = require('electron') // deconstructing assignment
// shell.openPath(__dirname) // Open the given file in the desktop's default manner.
const directoryPath = __dirname;
//passsing directoryPath and callback function
// fs.readdir(directoryPath, function (err, files) {
//     //handling error
//     if (err) {
//         return console.log('Unable to scan directory: ' + err);
//     } 
//     //listing all files using forEach
//     files.forEach(function (file) {
//         // Do whatever you want to do with the file
//         console.log(file); 
//     });
// });

let win;

function createWindow () {
  // console.log(dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] }))
  win = new BrowserWindow({
    width: 800, 
    height: 600,
    webPreferences: {
        nodeIntegration: true
    }})

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  // win.webContents.openDevTools();
  win.on('closed', () => {
    win = null
  });
  

  const isMac = process.platform === 'darwin'

  const template = [
    {
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
          { role: 'close' }        
      ]
    }    
  ]
  if(process.env.NODE_ENV !== 'production'){
    template.push(

      {
        label:"view",
  
        submenu:[{ role: 'toggleDevTools',accelerator:'f12' }],
        
  
      }
    )
  }
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
app.on('ready', createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});


// SECTION: ipc

ipcMain.on('2', async (event, path) => { 
  console.log("show_dialog received");
  var dirs = await dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] });
  console.log(dirs)
  if(dirs == undefined){
    event.sender.sendSync('dirs', {dirs: "dirs"})
  }else{
    event.sender.sendSync('dirs', {
      dirs:dirs
    });
  }

});


// Event handler for asynchronous incoming messages
ipcMain.on('show_dialog', async (event, arg) => {
  console.log(arg)
  var dirs = await dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] });
  console.log("dirs");
  console.log(dirs);
  // Event emitter for sending asynchronous messages
  event.sender.send('show_dialog-reply', dirs)
})
