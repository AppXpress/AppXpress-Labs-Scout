/**
 * @ngdoc service
 * @name starter.services.NotificationService
 * @description Push notification service
 * @requires [$q, $rootScope, $cordovaDevice, $http, $filter, $cordovaPush]
 * @author nthusitha
 * @since 0.0.1
 */
angular.module('starter.services').factory('NotificationService', NotificationService);

NotificationService.$inject = [ '$q', '$rootScope', '$cordovaDevice', '$http', '$filter', '$cordovaPush' ];

function NotificationService($q, $rootScope, $cordovaDevice, $http, $filter, $cordovaPush) {

	var pushNotification;
	var $q_ = $q;
	var $filter_ = $filter;
	// depends on the cordova device plugin.
	var device = $cordovaDevice.getDevice();
	// google project nubmer is the sender Id
	// var gcm_sender_id = "790282981369";
	var platform, http_, alerts_, platformSubscriberId_, authToken_, badgeCount_;
	badgeCount_ = 0;
	function errorHandler(error) {
		if (weather_config.debug) {
			console.log("error" + error);
		}
	}

	// result contains any message sent from the plugin call
	function successHandler(result) {
		if (weather_config.debug) {
			alert('result = ' + result);
		}

	}

	// iOS token handler
	var apnsTokenHandler = function(token) {
		// Your iOS push server needs to know the token before it can push to
		// this
		// device
		// here is where you might want to send it the token for later use.
		// alert('device token = ' + result);
		if (weather_config.alert) {
			alert("token handler");
		}

		if (weather_config.debug) {
			// alert("syncing device uids..")
			console.log("regID = " + token);
			console.log("Syncing apple device uid....");
		}

		syncDeviceTokenWithMiddleServer('apns', token, platformSubscriberId_, authToken_).then(function(response) {

			if (response && response.status == 'ok' && response.pushSubscId && response.pushSubscId.length > 0) {
				// store the pushdSubscriberId in the local storage.
				localStorage.setItem(weather_config.local_storage_pushd_subscriber_id_key, response.pushSubscId);
			}
		});
	}

	/* Sync deviceToken with the Middle Server */
	function syncDeviceTokenWithMiddleServer(platform, deviceToken, platformSubscriberId, authToken) {
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

			return $http(postReq).then(function(result) { // success

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

	// iOS - Deprecated, instead use the app.global.js fn
	this.onNotificationAPN = function(event, notification) {
		// alert("apple notification");
		// alert(alerts_.all());

		// populate notifications
		var now = $filter_('date')(new Date, "MM-dd-yyyy h:mma");
		var incomingAlert = {
			id : 4,
			name : event.alert,
			lastText : event.longTxt,
			face : event.img,
			receivedTime : now
		};
		alerts_.add(incomingAlert);

		try {

			if (event.alert) {
				if (navigator.notification) {
					navigator.notification.alert(event.alert);
				}
			}

			if (event.sound) {
				var snd = new Media(event.sound);
				snd.play();
			}

			if (event.badge) {
				// pushNotification.setApplicationIconBadgeNumber(successHandler,
				// errorHandler, event.badge);
				// angularize badge increment
				$cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
					badgeCount_++;
					if (weather_config.debug) {
						console.log("incremented badge count to " + badgeCount_);
					}
				}, function(err) {
					if (weather_config.debug) {
						console.log("error incrementing badge count, current badgeCount is " + badgeCount_);
					}
				});
			}

		} catch (err) {
			if (weather_config.debug) {
				console.log("error occured" + "\n" + err);
			}
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
					syncDeviceTokenWithMiddleServer('gcm', e.regid, platformSubscriberId_, authToken_).then(function(response) {

						if (response && response.status == 'ok' && response.pushSubscId && response.pushSubscId.length > 0) {
							// store the pushdSubscriberId in the local storage.
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
					var soundfile = e.soundname || e.payload.sound;
					// if the notification contains a soundname, play it.
					var my_media = new Media("/android_asset/www/" + soundfile);
					my_media.play();
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
	// BlackBerry10
	function pushNotificationHandler(pushpayload) {
		var contentType = pushpayload.headers["Content-Type"], id = pushpayload.id, data = pushpayload.data; // blob

		// If an acknowledgement of the push is required (that is, the push was
		// sent as a confirmed push
		// - which is equivalent terminology to the push being sent with
		// application level reliability),
		// then you must either accept the push or reject the push
		if (pushpayload.isAcknowledgeRequired) {
			// In our sample, we always accept the push, but situations might
			// arise where an application
			// might want to reject the push (for example, after looking at the
			// headers that came with the push
			// or the data of the push, we might decide that the push received
			// did not match what we expected
			// and so we might want to reject it)
			pushpayload.acknowledge(true);
		}
	}

	return {

		/*
		 * tokenHandlerCallback - Call back invoked after successfully
		 * registered with corresponding platform service (GCM, APNS).
		 */
		registerForPushNotifications : function($http, alerts, platformSubscriberId, authToken) {

			if ($http && alerts && platformSubscriberId && authToken) {

				http_ = $http;
				alerts_ = alerts;
				platformSubscriberId_ = platformSubscriberId;
				authToken_ = authToken;
				if (weather_config.debug) {
					console.log("device ready");
				}

				pushNotification = window.plugins.pushNotification;

				// TODO: UI Handle
				if (weather_config.debug) {
					console.log("registering " + device.platform);
				}

				if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
					platform = "google";
					//hack for gcm
					initalizeGCMPushContext(http_, pushNotification, $filter, platformSubscriberId_, authToken_);
					pushNotification.register(successHandler, errorHandler, {
						"senderID" : weather_config.gcm_sender_id,
						// ecb; event call back
						"ecb" : "onNotification"
					});
				} else if (device.platform == 'blackberry10') {
					platform = "blackberry";
					pushNotification.register(successHandler, errorHandler, {
						invokeTargetId : "replace_with_invoke_target_id",
						appId : "replace_with_app_id",
						ppgUrl : "replace_with_ppg_url", // remove for BES
						// pushes
						ecb : "pushNotificationHandler",
						simChangeCallback : replace_with_simChange_callback,
						pushTransportReadyCallback : replace_with_pushTransportReady_callback,
						launchApplicationOnPush : true
					});
				}/*
				var a = 1;
				if (a == 2) {

				} */ else {
					if (weather_config.alert) {
						alert("setting ios device..");
					}
					platform = "ios";
					// workaround to invoke the global scope fn outside angular
					// relm.

					initializePushContext(http_, pushNotification, $filter);
					setGlobalAlerts(alerts_);

					// $rootScope.$on('$cordovaPush:notificationReceived',
					// this.onNotificationAPN);
					pushNotification.register(apnsTokenHandler, errorHandler, {
						"badge" : "true",
						"sound" : "true",
						"alert" : "true",
						"ecb" : "onNotificationAPN"
					});
				}
			}
		},
		/*
		 * Un-register device from the corresponding service (GCM, APNS).
		 */
		unregisterForPushNotification : function() {

			var defer = $q_.defer();
			if (weather_config.debug) {
				console.log("unregistering push");
			}

			var pushNotification_ = window.plugins.pushNotification;

			pushNotification_.unregister(function(s) {
				if (weather_config.debug) {

					console.log("success unregister");
				}

				if (weather_config.debug) {
					console.log(s);
				}

				defer.resolve('successfully un-register from apns');
			}, function(e) {
				if (weather_config.alert) {
					alert("fail push unregister");
				}

				if (weather_config.debug) {
					console.log(e);
				}
				defer.reject('error occured while un-registering from apns');
			});

			return defer.promise;
		}
	}

}