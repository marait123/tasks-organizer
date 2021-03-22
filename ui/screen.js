const { extend } = require("jquery");
// fs = require("fs");
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
class TodoScreen extends Screen {
	constructor(todos_state) {
		super();
		// this.subTodos = todos_state.subTodos;
		this.todos_state = todos_state;
	}

	render() {
		$("#main-content-div").append(`<div id="todo-div"></div>`);
		$("#todo-div").append(`<div class="todo-title">
				<input
					type="text"
					name="todo-title"
					id="todo-title-input"
					value="${this.todos_state.title}"
                    onfocusout="save_title()"

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
		this.todos_state.subTodos.forEach((value, index, arr) => {
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
		$("head").append(`
		<script class="TodoScreen">
		var input = document.getElementById("todo-title-input");
		input.addEventListener("keydown", function (event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				save_title();
				$("#todo-title-input").blur();

			}
		});
		</script>
		`);
	}
	remove() {
		$("#todo-div").remove();
		$(".TodoScreen").remove();
	}

	expand(full) {
		let main_content_div = document.getElementById("main-content-div");
		if (full) {
			main_content_div.setAttribute("widthRatio", 1);
		} else {
			main_content_div.setAttribute("widthRatio", 0.8);
		}
	}
}

// screens area
let current_screen = new StartScreen();

module.exports.render_screen = (screen) => {
	if (current_screen != null) {
		current_screen.remove();
	}
	current_screen = screen;
	current_screen.render();
};

/**
 * this function is called whenever a sidebar is hidden or shown
 * @param {Object} _event this is an object with this {visible:false}
 */
module.exports.screen_change_width_handler = (_event) => {
	current_screen.expand(!_event.visible);

	console.log("screen event received", _event);
};

module.exports.TodoScreen = TodoScreen;
module.exports.StartScreen = StartScreen;
module.exports.Screen = Screen;
