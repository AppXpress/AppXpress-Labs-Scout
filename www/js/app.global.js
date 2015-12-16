/**
 * @ngdoc function
 * @name weather_config
 * @global
 * @description Unified global fn, which executes outside ng context.
 * @author nthusitha
 * @since 0.0.1
 */

var alertz_, $http_, $filter_, pushNotification_, syncGCMTokenCallBack_;
var platformSubscriberId_, authToken_;
var $injector_;

function initInjectorStub() {
	// TODO.
	$injector_ = angular.injector();

	// TO inject Alert service

	var alertService = $injector_.get("Alerts");
	// call all the public methods of Alerts using alerService.{methodname}
}

/*
 * As this fn executed outside ng realm it has to be initialized with ng dependencies.
 */
function initializePushContext($http, pushNotification, $filter) {
	if ($http && $filter && pushNotification) {
		$http_ = $http;
		$filter_ = $filter;
		pushNotification_ = pushNotification;
	}
}

/* Workaround for gcm */
function initalizeGCMPushContext($http, pushNotification, $filter, platformSubscriberId, authToken) {
	if ($http && $filter && pushNotification && platformSubscriberId && authToken) {
		$http_ = $http;
		$filter_ = $filter;
		pushNotification_ = pushNotification;
		platformSubscriberId_ = platformSubscriberId;
		authToken_ = authToken;
	}
}

/* Must be called first. */
function setGlobalAlerts(alerts) {
	alertz_ = alerts;
}

function onNotificationAPN(event) {
	// alert("apple notification");
	// alert(alerts_.all());

	var now = $filter_('date')(new Date, "MM-dd-yyyy h:mma");
	// populate notifications
	var incomingAlert = {
		id : 4,
		name : event.alert,
		lastText : event.longTxt,
		face : event.img,
		receivedTime : now
	};

	var now2 = $filter_('date')

	fetchDetailMessageFromMiddleServer(event.msguid).then(function(res) {
		console.log("inside the success method");
		console.log(res);
		console.log(res.status);
		if (res.status == 200) {
			// get weather icon

			alertz_.fetchServiceProviderForIcons($http_).then(function(res) {
				var imageFile = "";
				if (res.status != "error") {
					var iconsArray = weather[res.data.provider];
					for (var i = 0; i < iconsArray.length; i++) {
						var dirtyTitleString = angular.lowercase(res.data.alerts[0].title);
						console.log("dirty title: " + dirtyTitleString);
						if (dirtyTitleString.trim() == iconsArray[i].code) {
							imageFile = "img/" + iconsArray[i].icon;
							if (weather_config.debug) {
								console.log("weather icon is " + iconsArray[i].icon);
							}
							break;
						}
					}

				} else {
					if (weather_config.debug) {
						console.log("error occured resolving alert icon; failed getting weather provider" + "\n" + err);
					}
				}

				var alerts = {
					id : event.msguid,
					name : res.data.alerts[0].title,
					lastText : res.data.alerts[0].detail,
					subTitle : 'Subtitle here',
					face : imageFile,
					background : 'eq',
					// keyValue : '4.0',
					// keyValue2 : 'M',
					effectedSuppliers : [ {
						name : 'Kapare India Ltd',
						po : [ '8749433', '5343433' ]
					}, {
						name : 'Yangmao Industries',
						po : [ '366465' ]
					} ],
					receivedTime : now
				};

				alertz_.add(alerts);
			});

		}

	});

	try {

		if (event.alert) {
			if (navigator.notification) {
				//supress notification alerts in the middle of the screen
				//navigator.notification.alert(event.alert);
			}

		}

		if (event.sound) {
			var snd = new Media(event.sound);
			snd.play();
		}

		if (event.badge) {
			pushNotification_.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
		}

	} catch (err) {
		if (weather_config.debug) {
			console.log("error occured" + "\n" + err);
		}
	}

}

function getIcon(title) {

	alertz_.fetchServiceProviderForIcons($http_).then(function(res) {
		if (res.status != "error") {
			var iconsArray = weather[res.data.provider];
			for (var i = 0; i < iconsArray.length; i++) {
				if (angular.lowercase(title) == iconsArray[i].code) {
					return "img/" + iconsArray[i].code;
					if (weather_config.debug) {
						console.log("weather icon is " + iconsArray[i].icon);
					}
				}
			}
		} else {
			if (weather_config.debug) {
				console.log("error occured resolving alert icon; failed getting weather provider" + "\n" + err);
			}
		}
	});

}

function successHandler(result) {
	if (weather_config.debug) {
		console.log('result = ' + result);
	}

}

function errorHandler(error) {
	if (weather_config.debug) {
		console.log("error" + error);
	}
}

// Android and Amazon Fire OS
function onNotification(e) {
	if (weather_config.debug) {
		console.log("notification received");
	}

	// TODO: UI Handle
	// $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event +
	// '</li>');
	if (weather_config.debug) {
		console.log("RECEIVED " + e.event);
	}

	switch (e.event) {
		case 'registered':
			if (e.regid.length > 0) {
				// TODO: UI Handle

				// Your GCM push server needs to know the regID before it
				// can push to this device
				// here is where you might want to send it the regID for
				// later use.,
				if (weather_config.debug) {
					console.log("regID = " + e.regid);
					console.log("Syncing deviceuid....");
				}

				// Sync Google RegID with the backend.
				syncGCMDeviceTokenWithMiddleServer('gcm', e.regid, platformSubscriberId_, authToken_).then(function(response) {

					if (response && response.status == 'ok' && response.pushSubscId && response.pushSubscId.length > 0) {
						// store the pushdSubscriberId in the local
						// storage.
						localStorage.setItem(weather_config.local_storage_pushd_subscriber_id_key, response.pushSubscId);
					}
				});
			}
			break;

		case 'message':
			// if this flag is set, this notification happened while we were
			// in the foreground.
			// you might want to play a sound to get the user's attention,
			// throw up a dialog, etc.
			if (e.foreground) {
				// TODO: UI Handle
				// on Android soundname is outside the payload.
				// On Amazon FireOS all custom attributes are contained
				// within payload
				if (e.soundname && e.payload.sound) {
					var soundfile = e.soundname || e.payload.sound;
					// if the notification contains a soundname, play it.
					var my_media = new Media("/android_asset/www/" + soundfile);
					my_media.play();
				}

			} else { // otherwise we were launched because the user
				// touched a notification in the notification tray.
				if (e.coldstart) {

					if (weather_config.debug) {
						console.log("--COLDSTART NOTIFICATION--");
					}
				} else {

					if (weather_config.debug) {
						console.log("--BACKGROUND NOTIFICATION--");
					}
				}
			}
			if (weather_config.debug) {
				console.log("MESSAGE -> MSG: " + e.payload.message);
				console.log("MESSAGE -> MSGCNT: " + e.payload.msgcnt);
				console.log("MESSAGE -> TIME: " + e.payload.timeStamp);
			}

			// Only works for GCM
			// $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' +
			// e.payload.msgcnt + '</li>');
			// Only works on Amazon Fire OS
			// $status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp
			// + '</li>');
			break;

		case 'error':
			if (weather_config.debug) {
				console.log("ERROR -> MSG:" + e.msg);
			}

			break;

		default:
			// $("#app-status-ul").append('<li>EVENT -> Unknown, an event
			// was received and we do not know what it is</li>');
			if (weather_config.debug) {
				console.log("Unknown, an event was received and we do not know what it is");
			}

			break;
	}
}

// fetch the detail message from Middle server

function fetchDetailMessageFromMiddleServer(msguid) {
	if (msguid) {
		var url = weather_config.weather_server + weather_config.middle_server_detail_alert_url;

		var getReq = {
			method : 'GET',
			url : url,
			headers : {
				'Content-Type' : 'application/json'
			},
			params : {
				uid : msguid
			}
		}

		return $http_(getReq).then(function(result) { // success

			console.log("Success retriving alert details " + JSON.stringify(result));
			// console.log(result);
			var response = new Object();
			response.status = result.status;
			response.data = result.data;
			// response.pushSubscId = pushSubscriberId;
			return response;

		}, function(e) { // error console.log("Error " +
			console.log("Error retriving alert details" + JSON.stringify(e));
			var result = e;
			var response = new Object();
			response.status = "error";
			return response;
		});
	}

}

// fetching all alerts from a time period
function fetchAllAlertsByTimeFromMiddleServer(platformSubscriberId, beginTimeUtc, endTimeUtc) {
	if (platformSubscriberId && beginTimeUtc && endTimeUtc) {
		var url = weather_config.weather_server + weather_config.middle_server_all_alerts_url;

		var getReq = {
			method : 'POST',
			url : url,
			headers : {
				'Content-Type' : 'application/json'
			},
			params : {
				platformSubscriberId : platformSubscriberId,
				beginTimeUtc : beginTimeUtc,
				endTimeUtc : endTimeUtc
			}
		}

		return $http_(getReq).then(function(result) { // success

			console.log("Success retriving alert details " + JSON.stringify(result));
			// console.log(result);
			var response = new Object();
			response.status = result.status;
			response.data = result.data;
			// response.pushSubscId = pushSubscriberId;
			return response;

		}, function(e) { // error console.log("Error " +
			console.log("Error retriving alert details" + JSON.stringify(e));
			var result = e;
			var response = new Object();
			response.status = "error";
			return response;
		});
	}

}

function convertToUTC(time) {
	var day = time.getUTCDate();
	var fullyear = time.getUTCFullYear();
	var month = time.getUTCMonth() + 1;
	var hour = time.getUTCHours();
	var minutues = time.getUTCMinutes();
	var seconds = time.getUTCSeconds();

	var fullDate = fullyear + "-" + month + "-" + day + " " + hour + ":" + minutues + ":" + seconds;
	return fullDate;
}

// gcm hack

/* Sync deviceToken with the Middle Server */
function syncGCMDeviceTokenWithMiddleServer(platform, deviceToken, platformSubscriberId, authToken) {
	if (platform && deviceToken && platformSubscriberId) {
		var device = new Object();
		device.platform = platform;
		device.deviceToken = deviceToken;
		device.platformSubscriberId = platformSubscriberId;

		var url = weather_config.weather_server + weather_config.middle_server_device_register_url;

		var postReq = {
			method : 'POST',
			data : JSON.stringify(device),
			url : url,
			headers : {
				'Content-Type' : 'application/json'
			}
		}

		return $http_(postReq).then(function(result) { // success

			console.log("Success sending apns device token" + JSON.stringify(result));
			var res = result.data;
			var pushSubscriberId = res.pushSubscId;
			var response = new Object();

			response.status = res.status;
			response.pushSubscId = pushSubscriberId;
			return response;

		}, function(e) { // error console.log("Error " +
			console.log("Error psending apns device token" + JSON.stringify(e));
			var result = e;
			var response = new Object();
			response.status = "error";
			return response;
		});

	}

}

/*
 * Quick hack to get around issues with seperate system browser (no back button, toolbar etc). Make sure you add
 * 	window.open = cordova.InAppBrowser.open; 
 * 
 * inside ng configuration phase.
 * 
 * Following method must be called outside angular relm.
 * 
 * */
function handleAnchorsWithInAppBrowser(anchors){
	var Anchors = anchors;
	console.log("anchor length:" + Anchors.length);
	for (var i = 0; i < Anchors.length; i++) {
		Anchors[i].addEventListener("click", function(event) {
			event.preventDefault();
			//_system = default sysetm browser (safari in ios)
			var ref = cordova.InAppBrowser.open(this.href, '_system', 'location=yes');

		}, false);
	}
}

/*
 * DO NOT USE, Use initInAppBrowser() instead.
 * */
function initInAppBrowserDeprecated() {
	var Anchors = document.getElementsByClassName("socialfeed");
	console.log("anchor length:" + Anchors.length);
	for (var i = 0; i < Anchors.length; i++) {
		Anchors[i].addEventListener("click", function(event) {
			event.preventDefault();
			//_system = default sysetm browser (safari in ios)
			var ref = cordova.InAppBrowser.open(this.href, '_system', 'location=yes');

		}, false);
	}

}


/*
 * Handle all anchors inside social feed pane with a seperate sytem browser with back button etc.
 * */
function initInAppBrowser() {
	var anchors = document.getElementsByClassName("socialfeed");
	handleAnchorsWithInAppBrowser(anchors);

}


/*
 * Handle all anchors in Google Map with an seperate system browser with back button etc.
 * i.e.Handle terms of use link within an in-app browser.
 * */
function handleAnchorsInGoogleMap(){
	var anchors = [].filter.call( document.getElementsByTagName("a"), function( input ) {
			//search for google anchors
  			return input.href.search("google.com") > -1 ? true: false;
});
	handleAnchorsWithInAppBrowser(anchors);
}



