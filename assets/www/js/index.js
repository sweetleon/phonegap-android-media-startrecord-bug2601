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

document.addEventListener("deviceready", function() {
	var RECORD_FILENAME = 'listen.';
	var TIME_WINDOW_MS = 100;

	function shush() {
		var path = window.location.pathname;
    path = path.substr( path, path.lastIndexOf('/') );
		new Media("file://" + path + "/audio/shush.mp3").play();
	}
	shush();

	var recordToFile = RECORD_FILENAME;
	switch (device.platform) {
    case 'iOS':
			recordToFile += 'amr';
      break;
		default: // Android, Blackberry
      recordToFile += 'wav';
	}

	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function gotFsForCreateBlank(fileSystem) {
	  var RECORD_FILEPATH = fileSystem.root.fullPath + '/' + recordToFile;
    console.log('creating ' + RECORD_FILEPATH);
    fileSystem.root.getFile(recordToFile, {create: true, exclusive: false}, function() {
        console.log("Initializing audio...");
        navigator.audio = new Media(RECORD_FILEPATH, function(){},logToConsoleFunc('FAILED to create Media to record'));
        console.log("Initializing audio...OK");
    }, logToConsoleFunc("getFile (create)"));

    function recorder() {
        console.log("Starting recording...");
        navigator.audio.startRecord();
        console.log("Starting recording...OK");

        setTimeout(function stopRecording() {
          console.log("Stopping recording...");
          navigator.audio.stopRecord();
          console.log("Stopping recording...OK");
          recorder();

					console.log(document.getElementsByTagName("audio")[0].src)
        }, TIME_WINDOW_MS);
		}
		recorder();
	}, logToConsoleFunc("requestFileSystem"));
}, logToConsoleFunc("deviceready"));
