// const ipc = electron.ipcRenderer
const fs = require("fs");
const $ = require("jquery");
const { ipcRenderer } = require("electron");
const exec = require("child_process");
const {
	Screen,
	StartScreen,
	TodoScreen,
	render_screen,
} = require("./ui/screen");

app_state = {
	currentList: 0,
	last_id: 1,
	get_new_id() {
		this.last_id++;
		return this.last_id - 1;
	},
	lists: [],
	setCurrentList(_list_state) {
		this.title = _list_state.title;
		this.path = _list_state.path;
	},
};

list_state = {
	title: "untitled",
	id: -1,
	last_id: 1,
	completed: false,
	saved: false,
	modified: false,
	folderPath: "", // this is where the folder lies
	filePath: ".", // this is where user saved the file
	name: "untitled.todo",
	text: "None",
	subTodos: [],
	reset() {
		this.title = "untitled";
		this.last_id = 1;
		this.completed = false;
		this.saved = false;
		this.modified = false;
		this.folderPath = ""; // this is where the folder lies
		this.filePath = "."; // this is where user saved the file
		this.name = "untitled.todo";
		this.text = "None";
		this.subTodos = [];
	},
	setModified(modified) {
		this.modified = modified;
	},
	setFolderPath(folderPath) {
		this.folderPath = folderPath;
	},
	setTitle(title) {
		this.title = title;
		if (this.saved) {
			this.save();
		}
	},
	check_todo(id, checked) {
		if (this.saved) {
			this.save();
		}
		this.setModified(true);

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
		this.setModified(false);
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
		this.setModified(true);

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
			list_state.insertTodo(list_state, value);
		});
		render_screen(new TodoScreen(list_state));
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

function save_title() {
	let title_input = document.getElementById("todo-title-input");
	if (title_input && list_state.title != title_input.value) {
		list_state.setTitle(title_input.value);
	}
}
document.addEventListener("DOMContentLoaded", render_screen(new StartScreen()));

function check_todo_change(id) {
	let checkbox = document.getElementById(`${id}`);
	list_state.check_todo(id, checkbox.checked);
}
function check_todo(id) {
	let checkbox = document.getElementById(`${id}`);
	checkbox.checked = !checkbox.checked;
	list_state.check_todo(id, checkbox.checked);
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
	let todo = list_state.getTodo(id);

	todo_path = `${list_state.folderPath}\\${todo.path}`;
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
	if (list_state.saved) {
		list_state.save();
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
	// console.log("menue data received", data);

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
		list_state.reset();
		list_state.load(data.filePaths[0]);
		render_screen(new TodoScreen(list_state));
		// list_state.render_todos();
	}
});
ipcRenderer.on("saved_file", (event, data) => {
	console.log("recieved: ");
	console.log(data);
	if (!data.canceled) {
		list_state.save(data.filePath);
	}
});

ipcRenderer.on("dir", (event, data) => {
	console.log("recieved: ");
	console.log(data);
	if (!data.canceled) {
		list_state.reset();
		let files = fs.readdirSync(data.filePaths[0]);
		let path_splitted = data.filePaths[0].split("\\");
		list_state.setTitle(path_splitted[path_splitted.length - 1]);
		// debug
		console.log(data.filePaths[0]);
		console.log(path_splitted);
		list_state.setFolderPath(data.filePaths[0]);
		list_state.insertFiles(files);
	}
});
