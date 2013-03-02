function logToConsoleFunc(name) {
	return function(err) {
		console.error("ERROR [" + name + "] " + JSON.stringify(err));
	}
}

var RECORD_FILENAME = 'listen.';
var RECORD_TIME_MS = 500;
var listener;

function shush() {
	var path = window.location.pathname;
	path = path.substr(path, path.lastIndexOf('/'));
	var shusher = new Media("file://" + path + "/audio/shush.mp3", function(){shusher.release();});
	shusher.play();
}

function showFileInfo(fileEntry) {
	fileEntry.file(function(file) {
		console.log("fileEntry.file " + file);

		setTimeout(function() {
			var reader = new FileReader();
			reader.onloadend = function(evt) {
					console.log("file size " + file.size);
					console.log("LISTENER: " + JSON.stringify(listener));
					console.log("onloadend " + JSON.stringify(evt));
					console.error(reader.result);
			};
			reader.readAsDataURL(file);
		}, 0);
	}, logToConsoleFunc("recordFileEntry.file"));
}

document.addEventListener("deviceready", function() {
	shush();

	var recordToFile = RECORD_FILENAME;
	var soundAnalyzerFn;
	switch (device.platform) {
		case 'iOS':
			recordToFile += 'wav';
			soundAnalyzerFn = function() {
				console.error("TODO: implement WAV analyzer")
			}
			break;
		default: // Android, Blackberry
			recordToFile += 'amr';
			soundAnalyzerFn = function() {
				console.error("TODO: implement AMR analyzer")
			}
	}

	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function gotFS(fileSystem) {
		console.error("file system root: " + fileSystem.root.fullPath);
		var recordFilePath = fileSystem.root.fullPath + '/' + recordToFile;
		console.log('creating ' + recordFilePath);
		fileSystem.root.getFile(recordToFile, {create: true, exclusive: false}, function gotFile(fileEntry) {
				console.log("creating media from " + JSON.stringify(fileEntry));
				console.log("file exists? " + fileEntry.file());
				listener = new Media(fileEntry.fullPath, function mediaStopped() {
					console.log("media done");
					listener.release();
					showFileInfo(fileEntry);
				}, logToConsoleFunc("new Media"));

			function recorder() {
				console.log("startRecord " + JSON.stringify(listener));
				listener.startRecord();

				setTimeout(function stopRecorder() {
					console.log("stopRecord " + JSON.stringify(listener));
					listener.stopRecord();

					recorder();
				}, RECORD_TIME_MS);
			}
			recorder();

			setTimeout(function() { showFileInfo(fileEntry); }, 2 * RECORD_TIME_MS);
		}, logToConsoleFunc("getFile"));
	}, logToConsoleFunc("requestFileSystem"));
});