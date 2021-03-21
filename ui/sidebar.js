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
	}
	render() {
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
			$("#side-content").append(`
            <div onclick="alert(${key})" class="list-item">${element.title}</div>
            `);
		}
	}
	remove() {
		$("#side-div").remove();
	}
}

current_sidebar = null;

module.exports.render_sidebar = (sidebar) => {
	if (current_sidebar != null) {
		current_sidebar.remove();
	}
	current_sidebar = sidebar;
	current_sidebar.render();
};

module.exports.ListsSidebar = ListsSidebar;
