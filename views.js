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
	screen_change_width_handler,
} = require("./ui/screen");

// const { resize_window, toggle_todo_list } = require("./ui/UI-refresher");

const {
	ListsSidebar,
	visibilty_change_handler,
	render_sidebar,
} = require("./ui/sidebar");
const { load_object_from_json, store_object_as_json } = require("./utilities");
const { constants } = require("buffer");
const app_state = {
	// currentList: 0,
	// last_id: 1,
	// get_new_id() {
	// 	this.last_id++;
	// 	return this.last_id - 1;
	// },
	lists: {}, // a list of lists with path as key and title props
	settings: {}, // For future when adding settings to the app
	filePath: "app_state.application", // file to store the settings temporarily

	load_state() {
		if (fs.existsSync(this.filePath)) {
			load_object_from_json(this, this.filePath);
		}
	},
	record(state) {
		// if not present
		if (!this.lists[state.filePath]) {
			this.lists[state.filePath] = {
				title: state.title,
			};
			this.save();
			render_sidebar(new ListsSidebar(app_state));
		} else {
			alert("unhandled filePath already exists");
			throw Error("unhandled filePath already exists");
		}
	},
	save() {
		let f_string = JSON.stringify(this);
		fs.writeFileSync(this.filePath, f_string);
		resize_window();
	},
	modifyTitle(path, new_title) {
		this.lists[path].title = new_title;
		render_sidebar(new ListsSidebar(this));
		this.save();
	},
	// setCurrentList(_list_state) {
	// 	this.title = _list_state.title;
	// 	this.path = _list_state.path;
	// },
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
			app_state.modifyTitle(this.filePath, title);
		}
	},
	check_todo(id, checked) {
		this.setModified(true);

		// this.subTodos[id].completed = checked;
		// TODO: recursive implementation
		for (let index = 0; index < this.subTodos.length; index++) {
			const element = this.subTodos[index];
			if (element.id == id) {
				element.completed = checked;
				break;
			}
		}
		if (this.saved) {
			this.save();
		}
	},

	save(filePath) {
		if (!filePath) {
			filePath = this.filePath;
		}
		this.filePath = filePath;
		this.saved = true;
		this.setModified(false);
		store_object_as_json(this, filePath);
		// change title of the object
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
	insertTodoInSubTodos(todo, path, note = "", completed = false) {
		this.setModified(true);
		todo = {
			id: this.get_new_id(),
			name: path,
			path: path,
			note: note,
			completed: completed,
			subTodos: [],
		};
		todo.subTodos.push(todo);
		return todo.subTodos[todo.subTodos.length - 1];
	},
	load(file_path) {
		load_object_from_json(this, file_path);
		render_screen(new TodoScreen(this));
	},
	insert_files_recursive(todo, files, path) {
		for (let index = 0; index < files.length; index++) {
			const value = files[index];
			full_path = path + "\\" + value;
			let new_todo = this.insertTodoInSubTodos(todo, full_path);
			let is_dir = fs.lstatSync(full_path).isDirectory();
			console.log("full path is ", full_path);
			console.log("is directory is ", is_dir);
			if (is_dir) {
				console.log("enetered nevertheless");
				let new_files = fs.readdirSync(full_path);
				console.log("new files are ", new_files);
				new_files.forEach((value, index, arr) => {
					this.insert_files_recursive(new_todo, new_files, full_path);
				});
			}
			console.log(full_path);
			// new_value;
			// list_state.insertTodo(list_state, path);
		}
	},
	// note folder path must be set before call
	insertFiles(files) {
		// console.log(this.folderPath);
		// this.insert_files_recursive(this, files, this.folderPath);
		// render_screen(new TodoScreen(list_state));
		// return;
		console.log("the files are ", files);
		files.forEach((value, index, arr) => {
			list_state.insertTodo(list_state, value);
		});
		render_screen(new TodoScreen(list_state));
	},
	getTodo(id) {
		//TODO: change to  recursive implementation
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
function save_title_enter() {}
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
function switchList(path) {
	console.log("path is ", path);
	list_state.load(path);
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

function on_start() {
	app_state.load_state();
	console.log(ui_refresher);
	ui_refresher.subscribe("toggle_sidebar", visibilty_change_handler);
	ui_refresher.subscribe("toggle_sidebar", screen_change_width_handler);

	render_screen(new StartScreen());
	render_sidebar(new ListsSidebar(app_state));
	console.log("render side bar");
}

document.addEventListener("DOMContentLoaded", on_start());
