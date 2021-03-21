const fs = require("fs");

module.exports.store_object_as_json = (object, filePath) => {
	let f_string = JSON.stringify(object);
	fs.writeFileSync(filePath, f_string);
};

module.exports.load_object_from_json = (object, filePath) => {
	let data = fs.readFileSync(filePath, "utf8");
	let state = JSON.parse(data);
	for (let prop in state) {
		object[prop] = state[prop];
	}
};
