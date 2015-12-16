/**
 * @ngdoc function
 * @name starter.controllers.Alerts
 * @description Controlls alerts
 * @requires [$filter, $http, $q, platformSubscriberService]
 * @since 0.0.1
 */
angular.module('starter.services').factory('Alerts', Alerts);

Alerts.$inject = [ '$filter', '$http', '$q', 'platformSubscriberService' ];
function Alerts($filter, $http, $q, platformSubscriberService) {

	var $http_ = $http;
	var $q_ = $q;

	// fetching all alerts from a time period
	function fetchAllAlertsByTimeFromMiddleServer_($http, platformSubscriberId, beginTimeUtc, endTimeUtc) {
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

			return $http(getReq).then(function(result) { // success

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
	function fetchSocianInfo_($http, address) {
		if (address) {
			var url = weather_config.social_info_url + "?q=Weather," + address;

			var getReq = {
				method : 'POST',
				url : url,
				headers : {
					'Content-Type' : 'application/json'
				},
				params : {

					count : 3
				}
			}

			return $http(getReq).then(function(result) { // success

				console.log("Success retriving alert details " + JSON.stringify(result));
				// console.log(result);
				var response = new Object();
				response.status = result.status;
				response.data = result.data;
				// response.pushSubscId = pushSubscriberId;
				return response;

			}, function(e) { // error console.log("Error " +
				console.log("Error retriving social info" + JSON.stringify(e));
				var result = e;
				var response = new Object();
				response.status = "error";
				return response;
			});
		}

	}

	// fetching service provider for weather icons.
	function fetchServiceProviderForIcons_($http) {

		var url = weather_config.weather_server + weather_config.get_weather_provider_url;

		var getReq = {
			method : 'GET',
			url : url,
			headers : {
				'Content-Type' : 'application/json'
			}
		}

		return $http(getReq).then(function(result) { // success

			console.log("Success retriving Weather provider details " + JSON.stringify(result));
			// console.log(result);
			var response = new Object();
			response.status = result.status;
			response.data = result.data;
			// response.pushSubscId = pushSubscriberId;
			return response;

		}, function(e) { // error console.log("Error " +
			console.log("Error retriving Weather provider details " + JSON.stringify(e));
			var result = e;
			var response = new Object();
			response.status = "error";
			return response;
		});

	}

	/*
	 * Get affected party information by subsciberId and subscriptionId.
	 */
	function getAffectedParty_(subscriberId, subscriptionId) {

		if (subscriberId != null && subscriberId != 'undefined' && subscriptionId != null && subscriptionId != 'undefined') {
			var q = $q_.defer();
			var authToken = localStorage.getItem(weather_config.local_storage_auth_token_key);
			platformSubscriberService.getSubscriberDetails(subscriberId, authToken).success(function(data, status) {

				if (data.hasOwnProperty("platformSubscriptions")) {

					var subsciptionArray = data.platformSubscriptions;
					var affectedParty = null;
					for (var j = 0; j < subsciptionArray.length; j++) {
						if (subscriptionId == subsciptionArray[j].uid) {
							affectedParty = subsciptionArray[j].watchedFactory;
							break;
						}
					}

					if (affectedParty != null) {
						q.resolve(affectedParty);
					} else {
						q.reject("unable to find the matching subscription, user might have removed the subscription");
					}

				} else {
					// no subscriptions
					q.reject("no subscriptions");
				}

			}).error(
				function(error) {
					if (weather_config.debug) {
						console.log("error occured fetching subscriber details, in alert detail screen" + ", subscriberId:"
							+ subscriberId);
					}
					q.reject("error");

				});
			return q.promise;
		} else {
			throw "Illegal argument subscriberId and subscriptionId can't be null";
		}

	}

	// Might use a resource here that returns a JSON array
	var now = $filter('date')(new Date, "MM-dd-yyyy h:mma");
	// Some fake testing data
	var alerts = [ {
		id : 0,
		name : 'Earthquake Alert, Rajasthan - India',
		lastText : 'A 4.0 magnitude earthquake was recorded 52km away from the capital city of Jaipur',
		subTitle : 'Damage to the Jagatpura Railway Bridge was reported, hindering transport of goods and services',
		face : 'img/17.png',
		background : 'background eq',
		keyValue : '4.0',
		keyValue2 : 'M',
		effectedSuppliers : [ {
			name : 'Kapare India Ltd',
			po : [ '8749433', '5343433' ]
		}, {
			name : 'Yangmao Industries',
			po : [ '366465' ]
		} ],
		receivedTime : now
	} ];

	return {
		all : function($http, platformSubscriberId, beginTimeUtc, endTimeUtc) {
			return fetchAllAlertsByTimeFromMiddleServer_($http, platformSubscriberId, beginTimeUtc, endTimeUtc);
		},
		remove : function(alert) {
			alerts.splice(alerts.indexOf(alert), 1);
		},
		get : function(alertId) {
			for (var i = 0; i < alerts.length; i++) {
				if (alerts[i].id === parseInt(alertId)) {
					return alerts[i];
				}
			}
			return null;
		},
		add : function(incomingAlert) {
			return alerts.push(incomingAlert);
		},
		assign : function(alertArray) {
			alerts = alertArray;
			return alerts;
		},
		sort : function(alertsArray) {
			// TODO: Implement this.
			return []; // Sorted set
		},
		fetchSocialInfo : function($http, address) {
			return fetchSocianInfo_($http, address);
		},
		fetchServiceProviderForIcons : function($http) {
			return fetchServiceProviderForIcons_($http);
		},
		getAffectedParty : function(subscriberId, subscriptionId) {
			return getAffectedParty_(subscriberId, subscriptionId);
		}
	};
}