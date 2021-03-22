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
		app_state.record(list_state);

		// send list_state to app_state
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
