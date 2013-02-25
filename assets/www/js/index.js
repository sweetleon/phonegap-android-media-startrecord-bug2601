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
/*
    var shush = new Media('file://www/audio/shush.mp3',
        function onSuccess() {
            console.log("shush.mp3 loaded and ready");
            shush.play();
        }, logToConsoleFunc("new Media shush"));
    shush.play();
*/
	var RECORD_FILENAME = 'listen.';
	var TIME_WINDOW_MS = 100;

	function shush() {
		console.log(document.getElementsByTagName("audio")[0].src);
		document.getElementsByTagName("audio")[0].play();
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




        }, TIME_WINDOW_MS);
		}
		recorder();
	}, logToConsoleFunc("requestFileSystem"));




/*
    console.log("record to file: " + recordToFile);
    var recorder = new Media(recordToFile, function onSuccess() {
    }, logToConsoleFunc("new Media recorder"));
    console.log("recorder: " + JSON.stringify(recorder));

    console.log("startRecord" + JSON.stringify(recorder));
    recorder.startRecord();
    setTimeout(function() {
        console.log("stopRecord" + JSON.stringify(recorder));
        recorder.stopRecord();
    }, 100);

    recorder.play();
*/
}, logToConsoleFunc("deviceready"));
