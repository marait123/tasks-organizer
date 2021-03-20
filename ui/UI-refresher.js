let side_appear = true;
function toggle_todo_list() {
	// alert("toggle todo list");
	let side_div = document.getElementById("side-div");
	let main_content_div = document.getElementById("main-content-div");

	if (side_appear) {
		side_div.style.display = "none";
		side_div.setAttribute("widthRatio", 0);
		main_content_div.setAttribute("widthRatio", 1);
	} else {
		side_div.style.display = "block";

		side_div.setAttribute("widthRatio", 0.2);
		main_content_div.setAttribute("widthRatio", 0.8);
	}
	side_appear = !side_appear;
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
