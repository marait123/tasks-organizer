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
	title: "untitled",
	completed: false,
	saved: false,
	modified: false,
	filePath: ".",
	name: "untitled.todo",
	text: "None",
	subTodos: [],
	check_todo(index, checked) {
		this.modified = true;
		this.subTodos[index].completed = checked;
	},
	save(filePath) {
		if (!filePath) {
			filePath = this.filePath;
		}
		this.filePath = filePath;
		this.saved = true;
		this.modified = false;
		console.log("appstate");
		console.log(this);
		let f_string = JSON.stringify(this);
		console.log("f_string");
		console.log(f_string);
		fs.writeFileSync(filePath, f_string);
	},
	insertTodo(todoMain, name, text = "", completed = false) {
		this.modified = true;
		todo = {
			name,
			text: text,
			completed: completed,
			subTodos: [],
		};
		todoMain.subTodos.push(todo);
	},
	load(file_path) {
		console.log("load is called with ", file_path);
		let data = fs.readFileSync(file_path, "utf8");
		let state = JSON.parse(data);
		console.log("state loaded", state);
		for (let prop in state) {
			this[prop] = state[prop];
		}
	},
	insertFiles(files) {
		files.forEach((value, index, arr) => {
			app_state.insertTodo(app_state, value);
		});
		render_screen(new TodoScreen(app_state.subTodos));
	},
	render_todos() {
		return;
	},
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
	constructor(subTodos) {
		this.subTodos = subTodos;
	}
	render() {
		$("#main-div").append(`<div id="todo-div"></div>`);
		$("#todo-div").append(`<div class="todo-title">
				<input
					type="text"
					name="todo-title"
					id="todo-title-input"
					value="${app_state.title}"
			/>
			<input
				type="button"
				id="todo-save"
				value="save"
				onclick="save_todos()"
			/>
		</div>`);
		let i = 1;
		var elements = $();
		this.subTodos.forEach((value, index, arr) => {
			// console.log(value);
			// this.insertTodo(app_state, value);
			elements = elements.add(`<div class="todo-item">  <input type="checkbox" onchange="check_todo_change(${i})" id="${i}" name="todo-${i}" value="done" ${
				value.completed ? "checked" : ""
			}>
        ${i}. ${value.name}</div>`);

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

document.addEventListener("DOMContentLoaded", render_screen(new StartScreen()));

function check_todo_change(id) {
	let checkbox = document.getElementById(`${id}`);
	app_state.check_todo(id - 1, checkbox.checked);
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
		if (!data.canceled) {
			let files = fs.readdirSync(data.filePaths[0]);
			app_state.insertFiles(files);
		}
	});
};
// TODO: save file
function save_todos() {
	// ipcRenderer.sendSync('synchronous-message', 'sync ping')
	// test
	// generate_todos(["hi 1", "hi 2", "hi 3"]);
	// return;
	if (app_state.saved) {
		app_state.save();
	} else {
		ipcRenderer.send("save_dialog", {
			do: "save_dialog",
		});
	}
}

// TODO: implement
function readFile() {
	ipcRenderer.send("load_dialog", {
		do: "load_dialog",
	});
}
ipcRenderer.on("menue", (event, data) => {
	console.log("menue data received", data);

	if (data.message == "close") {
		alert("recieved close");
	} else if (data.message == "open-file") {
		alert("recieved open-file");
	}
});
ipcRenderer.on("loaded_file", (event, data) => {
	console.log("recieved: ");
	console.log(data);
	if (!data.canceled) {
		app_state.load(data.filePaths[0]);
		render_screen(new TodoScreen(app_state.subTodos));
		// app_state.render_todos();
	}
});
ipcRenderer.on("saved_file", (event, data) => {
	console.log("recieved: ");
	console.log(data);
	if (!data.canceled) {
		app_state.save(data.filePath);
	}
});
