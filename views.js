// const ipc = electron.ipcRenderer
const fs = require("fs");
const $ = require("jquery");
const { ipcRenderer } = require("electron");

// a file is saved as
/*
{
    title:"koko wawa",
    completed:false,
    path:"./koko wawa.todo",  -->> this is the path in which the todo file is located
    subTodos:[
        {
            title:"",
            completed:false
        }
    ]
}
*/
app_state = {
    title: "untitled.",
    completed: false,
    folder: ".",
    path: "untitled.todo",
    subTodos: [],
};
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
            onclick="alert('implement open todo')"
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
            onclick="save_todos()"
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
    ipcRenderer.send("show_dialog", {
        do: "show_dialog",
    });

    ipcRenderer.on("dir", (event, data) => {
        console.log("recieved: ");
        console.log(data);
        let files = fs.readdirSync(data.filePaths[0]);
        // console.log(files);
        generate_todos(files);
    });
};
// TODO: save file
function save_todos() {
    // ipcRenderer.sendSync('synchronous-message', 'sync ping')
    // test
    // generate_todos(["hi 1", "hi 2", "hi 3"]);
    // return;
    ipcRenderer.send("save_dialog", {
        do: "save_dialog",
    });

    ipcRenderer.on("saved_file", (event, data) => {
        console.log("recieved: ");
        console.log(data);
    });
}

// TODO: remove
function readFile() {}
