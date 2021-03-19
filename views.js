// const ipc = electron.ipcRenderer
const fs = require("fs");
const $ = require("jquery");
const { ipcRenderer } = require("electron");
const exec = require("child_process");

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
todos_state = {
	title: "untitled",
	last_id: 1,
	completed: false,
	saved: false,
	modified: false,
	folderPath: "", // this is where the folder lies
	filePath: ".", // this is where user saved the file
	name: "untitled.todo",
	text: "None",
	subTodos: [],
	setFolderPath(folderPath) {
		this.folderPath = folderPath;
	},
	setTitle(title) {
		this.title = title;
	},
	check_todo(id, checked) {
		if (this.saved) {
			this.save();
		}

		this.modified = true;
		// this.subTodos[id].completed = checked;
		for (let index = 0; index < this.subTodos.length; index++) {
			const element = this.subTodos[index];
			if (element.id == id) {
				element.completed = checked;
				break;
			}
		}
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
	get_new_id() {
		this.last_id += 1;
		return this.last_id - 1;
	},
	insertTodo(todoMain, path, note = "", completed = false) {
		this.modified = true;
		todo = {
			id: this.get_new_id(),
			name: path,
			path: path,
			note: note,
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
			todos_state.insertTodo(todos_state, value);
		});
		render_screen(new TodoScreen(todos_state.subTodos));
	},
	getTodo(id) {
		for (let index = 0; index < this.subTodos.length; index++) {
			const element = this.subTodos[index];
			if (element.id == id) {
				return element;
			}
		}
	},
	render_todos() {
		return;
	},
};

// TODO: move screens to another file
class Screen {
	constructor() {}
	render() {}
	remove() {}
}

class StartScreen extends Screen {
	render() {
		console.log("laoded");
		$("#main-content-div")
			.append(`<div id="welcome-div" class="btn-collection">
            <button class="btn-block choose_folder" onclick="show_dialog()">choose folder</button>
            <button class="btn-block open_file" onclick="readFile()">open .todo</button>
          </div>`);
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
		$("#main-content-div").append(`<div id="todo-div"></div>`);
		$("#todo-div").append(`<div class="todo-title">
				<input
					type="text"
					name="todo-title"
					id="todo-title-input"
					value="${todos_state.title}"
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
			// this.insertTodo(todos_state, value);
			elements = elements.add(`<div class="todo-item">  
			<input type="checkbox" onchange="check_todo_change(${value.id})" id="${
				value.id
			}" name="todo-${value.id}" value="done" ${
				value.completed ? "checked" : ""
			}>
		<div class="todo-text" ondblclick="check_todo(${value.id})" > ${i}- ${
				value.name
			} </div>			
		<input
		type="button"
		id="todo-launch"
		value="launch"
		onclick="launch_todo(${value.id})"/>
	  </div>`);

			i++;
		});
		$("#todo-div").append(elements);
	}
	remove() {
		$("#todo-div").remove();
	}
}

// screens area
let current_screen = new StartScreen();

function render_screen(screen) {
	current_screen.remove();
	current_screen = screen;
	current_screen.render();
}

document.addEventListener("DOMContentLoaded", render_screen(new StartScreen()));

function check_todo_change(id) {
	let checkbox = document.getElementById(`${id}`);
	todos_state.check_todo(id, checkbox.checked);
}
function check_todo(id) {
	let checkbox = document.getElementById(`${id}`);
	checkbox.checked = !checkbox.checked;
	todos_state.check_todo(id, checkbox.checked);
}
const show_dialog = () => {
	// test
	// generate_todos(["hi 1", "hi 2", "hi 3"]);
	// return;
	ipcRenderer.send("show_dialog", {
		do: "show_dialog",
	});
};
// TODO: launch the corresponding todo using system
function launch_todo(id) {
	// alert("launch todo id " + id);
	let todo = todos_state.getTodo(id);

	todo_path = `${todos_state.folderPath}\\${todo.path}`;
	// add space it is important
	type_program = {
		directory: "explorer ",
		file: "",
	};
	todo_type = "file";
	if (fs.lstatSync(todo_path).isDirectory()) {
		todo_type = "directory";
	}

	console.log(`${type_program[todo_type]}"${todo_path}"`); // debug
	exec.exec(`${type_program[todo_type]}"${todo_path}"`);
}

// TODO: save file
function save_todos() {
	if (todos_state.saved) {
		todos_state.save();
	} else {
		ipcRenderer.send("save_dialog", {
			do: "save_dialog",
		});
	}
}

// this function intiates a file read operation
function readFile() {
	ipcRenderer.send("load_dialog", {
		do: "load_dialog",
	});
}

// messages area move to another file
ipcRenderer.on("menue", (event, data) => {
	console.log("menue data received", data);

	if (data.message == "close") {
		// alert("recieved close");
		render_screen(new StartScreen());
	} else if (data.message == "open-file") {
		// alert("recieved open-file");
		readFile();
	} else if (data.message == "choose-folder") {
		show_dialog();
	}
});
ipcRenderer.on("loaded_file", (event, data) => {
	console.log("recieved: ");
	console.log(data);
	if (!data.canceled) {
		todos_state.load(data.filePaths[0]);
		render_screen(new TodoScreen(todos_state.subTodos));
		// todos_state.render_todos();
	}
});
ipcRenderer.on("saved_file", (event, data) => {
	console.log("recieved: ");
	console.log(data);
	if (!data.canceled) {
		todos_state.save(data.filePath);
	}
});

ipcRenderer.on("dir", (event, data) => {
	console.log("recieved: ");
	console.log(data);
	if (!data.canceled) {
		let files = fs.readdirSync(data.filePaths[0]);
		let path_splitted = data.filePaths[0].split("\\");
		todos_state.setTitle(path_splitted[path_splitted.length - 1]);
		// debug
		console.log(data.filePaths[0]);
		console.log(path_splitted);
		todos_state.setFolderPath(data.filePaths[0]);
		todos_state.insertFiles(files);
	}
});
