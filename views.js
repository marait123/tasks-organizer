// const ipc = electron.ipcRenderer
const fs = require("fs");
const $ = require("jquery");
const { ipcRenderer } = require("electron");

function generate_todos(files) {
    $("#welcome-div").hide();
    $("#main-div").append(`<div id="todo-div"></div>`);
    console.log("files");
    let i = 0;
    files.forEach((value, index, arr) => {
        console.log(value);
        $("#todo-div")
            .append(`<div class="todo-item">  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
        <label for="vehicle1"> I have a bike</label>${i}. ${value}</div>`);
    });

    // console.log(files);
}

const show_dialog = () => {
    // test
    // generate_todos(["hi 1", "hi 2", "hi 3"]);
    // return;
    ipcRenderer.sendSync("show_dialog", {
        do: "show_dialog",
    });

    ipcRenderer.on("dir", (event, data) => {
        console.log("recieved: ");
        console.log(data);
        let files = fs.readdirSync(data.filePaths[0]);
        generate_todos(files);
    });
};

// TODO: remove
function readFile() {
    // Synchronous message emmiter and handler

    // Async message handler
    ipcRenderer.on("show_dialog-reply", (event, arg) => {
        console.log(arg);
        if (arg.canceled == false && arg.filePaths.length > 0) {
            console.log("render todos");
        }
    });

    // Async message sender
    ipcRenderer.send("show_dialog", "show_dialog");
}
