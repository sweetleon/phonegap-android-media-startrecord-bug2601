function logToConsoleFunc(errorType) {
	return function(error) {
		errMsg = "ERROR: [" + errorType + "] " + JSON.stringify(error);
		console && console.error ? console.error(errMsg) : alert(errMsg);
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

	window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function gotFsForCreateBlank(fileSystem) {
	  var recordFilePath = fileSystem.root.fullPath + '/' + recordToFile;
    console.log('creating ' + recordFilePath);
    fileSystem.root.getFile(recordToFile, {create: true, exclusive: false}, function gotFile(fileEntry) {
        console.log("creating media");
        listener = new Media(recordFilePath, function stoppedRecording(){
          console.error("media done");
          showFileInfo(fileEntry);

        },logToConsoleFunc('FAILED to create Media to record'));

				setTimeout(function() {recorder(fileEntry);}, 1000);

        setInterval(function filePrinter() {showFileInfo(fileEntry)}, 1000);
    }, logToConsoleFunc("getFile (create)"));

    function recorder(fileEntry) {
				showFileInfo(fileEntry);

        console.log("startRecord " + JSON.stringify(listener));
        listener.startRecord();

        setTimeout(function stopRecording() {
          console.log("stopRecord " + JSON.stringify(listener));
          listener.stopRecord();

					document.getElementById('output').innerHTML += ".";

//TODO          recorder(fileEntry);
        }, RECORD_TIME_MS);
		}
//		recorder();
	}, logToConsoleFunc("requestFileSystem"));
}, false);
