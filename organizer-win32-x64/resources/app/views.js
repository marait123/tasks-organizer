// const ipc = electron.ipcRenderer
const fs = require("fs");
const $ = require("jquery");
const { ipcRenderer } = require("electron");

function render_start_screen() {
    console.log("laoded");
    $("#main-div").append(`<div id="welcome-div" class="btn-collection">
    <button class="btn-block choose_folder" onclick="show_dialog()">choose folders</button>
    <button class="btn-block open_file" onclick="readFile()">open .todo</button>
  </div> `);
}

$(document).load(render_start_screen);
function generate_todos(files) {
    $("#welcome-div").hide();
    $("#main-div").append(`<div id="todo-div"></div>`);
    console.log("files");
    let i = 1;
    var elements = $();

    files.forEach((value, index, arr) => {
        console.log(value);
        elements = elements.add(`<div class="todo-item">  <input type="checkbox" id="${i}" name="todo-${i}" value="done">
        ${i}. ${value}</div>`);
        i++;
    });
    $("#todo-div").append(elements);

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
function readFile() {}
