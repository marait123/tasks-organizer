 // const ipc = electron.ipcRenderer

 const { ipcRenderer } = require('electron')
 function readFile(){
// Synchronous message emmiter and handler

    // Async message handler
    ipcRenderer.on('show_dialog-reply', (event, arg) => {
    console.log(arg);
    if(arg.canceled == false && arg.filePaths.length > 0){
        console.log("render todos");
    }
    })

    // Async message sender
    ipcRenderer.send('show_dialog', 'show_dialog')

}


 const show_dialog = () => {
    ipcRenderer.sendSync('show_dialog', {
        do:"show_dialog"
    }) 
     
     ipcRenderer.on('dirs', (event, data) => { 
        console.log(data);
     }) 
    }