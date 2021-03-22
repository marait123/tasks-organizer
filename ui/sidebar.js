// TODO: move screens to another file
class Sidebar {
	constructor() {}
	render() {}
	remove() {}
}

class ListsSidebar extends Sidebar {
	constructor(app_state) {
		super();
		this.app_state = app_state;
		this.visible = true;
	}
	setVisiblity(visible) {
		console.log("visible is ", visible);
		this.visible = visible;
		if (visible == true) {
			this.render();
		} else {
			this.remove();
		}
	}
	render() {
		if (this.visible) {
			console.log("appending side-content-div");
			$("#side-content-div").append(`
            <div id="side-div" widthRatio=".2">
                <div id="side-control">side-control</div>
                <div id="side-content">
                </div>
            </div>
        `);
			for (const key in this.app_state.lists) {
				// key here is the path
				const element = this.app_state.lists[key];
				let path = key.replaceAll("\\", "\\\\");
				console.log("path is path", path);
				$("#side-content").append(`
                <div onclick="switchList('${path}')" class="list-item">${element.title}</div>
                `);
				/*
	        $("#side-content").append(`
                <div onclick="switchList('${path}')" class="list-item">${
					element.title.length > 12
						? element.title.substr(0, 12) + "..."
						: element.title
				}</div>
                `);

                */
			}
		}
	}
	remove() {
		console.log("remove side-div");
		$("#side-div").remove();
	}
}

current_sidebar = null;

module.exports.render_sidebar = (sidebar) => {
	console.log("try to render");
	visiblity = true;
	if (current_sidebar != null) {
		visiblity = current_sidebar.visible;
		current_sidebar.remove();
	}
	current_sidebar = sidebar;
	current_sidebar.setVisiblity(visiblity);
	// if (current_sidebar != null) {
	// } else {
	// 	current_sidebar.render();
	// }
};

module.exports.visibilty_change_handler = (_event) => {
	current_sidebar.setVisiblity(_event.visible);
	console.log("event received", _event);
};
module.exports.ListsSidebar = ListsSidebar;
