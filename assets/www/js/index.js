/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

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
