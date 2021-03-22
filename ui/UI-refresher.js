ui_refresher = {
	side_appear: true,
	handlers: {
		toggle_sidebar: [],
	},
	fire(event_type, event) {
		for (let index = 0; index < this.handlers[event_type].length; index++) {
			const fn = this.handlers[event_type][index];
			fn(event);
		}
	},

	subscribe(event_type, fn) {
		this.handlers[event_type].push(fn);
	},
	unsubscribe(event_type, fn) {
		this.handlers[event_type] = this.handlers[event_type].filter(
			(fun) => fun != fn
		);
	},
};

function toggle_todo_list() {
	// alert("toggle todo list");
	let side_div = document.getElementById("side-div");
	let main_content_div = document.getElementById("main-content-div");

	if (ui_refresher.side_appear) {
		side_div.style.display = "none";
		side_div.setAttribute("widthRatio", 0);
		main_content_div.setAttribute("widthRatio", 1);
	} else {
		side_div.style.display = "block";

		side_div.setAttribute("widthRatio", 0.2);
		main_content_div.setAttribute("widthRatio", 0.8);
	}
	ui_refresher.side_appear = !ui_refresher.side_appear;
	ui_refresher.fire("toggle_sidebar", { appear: ui_refresher.side_appear });
	resize_window();
}
function resize_window() {
	var w = window.outerWidth;
	var h = window.outerHeight;

	var txt = "Window size: width=" + w + ", height=" + h;
	console.log(txt);
	let main_content_div = document.getElementById("main-content-div");
	let side_div = document.getElementById("side-div");
	let main_div = document.getElementById("main-div");
	console.log(main_div);
	main_div.style.height = `${h - 80}px`;

	main_content_div.style.width = `${
		(w - 40) * main_content_div.getAttribute("widthRatio")
	}px`;
	side_div.style.width = `${
		(w - 40) * side_div.getAttribute("widthRatio")
	}px`;

	console.log(main_content_div);
	console.log(side_div);
}
document.addEventListener("DOMContentLoaded", resize_window);
// module.exports.resize_window = resize_window;
// module.exports.toggle_todo_list = toggle_todo_list;
