function logErrorFunction(name) {
	return function() {
		console.error("ERROR [" + name + "] " + JSON.stringify(arguments));
	}
}

var RECORD_FILENAME = 'listen.';
var RECORD_TIME_MS = 500;
var listener;

function shush() {
	var path = window.location.pathname;
	path = path.substr(path, path.lastIndexOf('/'));
	new Media("file://" + path + "/audio/shush.mp3").play();
}

document.addEventListener("deviceready", function() {
	shush();
});