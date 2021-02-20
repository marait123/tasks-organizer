// const ipc = electron.ipcRenderer
const fs = require("fs");
const $ = require("jquery");
const { ipcRenderer } = require("electron");
class Screen {
    constructor() {}
    render() {}
    remove() {}
}

class StartScreen extends Screen {
    render() {
        console.log("laoded");
        $("#main-div").append(`<div id="welcome-div" class="btn-collection">
            <button class="btn-block choose_folder" onclick="show_dialog()">choose folders</button>
            <button class="btn-block open_file" onclick="readFile()">open .todo</button>
          </div> `);
    }
    remove() {
        $("#welcome-div").remove();
    }
}
class TodoScreen {
    constructor(files) {
        this.files = files;
    }
    render() {
        start_screen.remove();
        $("#main-div").append(`<div id="todo-div"></div>`);
        // console.log("files");
        $("#todo-div").append(`<div class="todo-title">
            <input
                type="text"
                name="todo-title"
                id="todo-title-input"
                value="untitled"
        />
        <input
            type="button"
            id="todo-save"
            value="save"
            onclick="alert('hi')"
        />
    </div>`);

        let i = 1;
        var elements = $();

        this.files.forEach((value, index, arr) => {
            console.log(value);
            elements = elements.add(`<div class="todo-item">  <input type="checkbox" id="${i}" name="todo-${i}" value="done">
        ${i}. ${value}</div>`);
            i++;
        });
        $("#todo-div").append(elements);
    }
    remove() {
        $("#todo-div").remove();
    }
}

// screens area
let start_screen = new StartScreen();
let current_screen = start_screen;

function render_screen(screen) {
    current_screen.remove();
    current_screen = screen;
    current_screen.render();
}

document.addEventListener("DOMContentLoaded", start_screen.render());

function generate_todos(files) {
    start_screen.remove();
    $("#main-div").append(`<div id="todo-div"></div>`);
    $("#todo-div").append(`<div class="todo-title">
            <input
                type="text"
                name="todo-title"
                id="todo-title-input"
                value="untitled"
        />
        <input
            type="button"
            id="todo-save"
            value="save"
            onclick="alert('hi')"
        />
    </div>`);
    // console.log("files");
    let i = 1;
    var elements = $();

    files.forEach((value, index, arr) => {
        console.log(value);
        elements = elements.add(`<div class="todo-item">  <input type="checkbox" id="${i}" name="todo-${i}" value="done">
        ${i}. ${value}</div>`);
        i++;
    });
    $("#todo-div").append(elements);
}

const show_dialog = () => {
    // test
    // generate_todos(["hi 1", "hi 2", "hi 3"]);
    // return;
    ipcRenderer.sendSync("show_dialog", {
        do: "show_dialog",
    });

    ipcRenderer.on("dir", (event, data) => {
        // console.log("recieved: ");
        // console.log(data);
        let files = fs.readdirSync(data.filePaths[0]);
        generate_todos(files);
    });
};

// TODO: remove
function readFile() {}
