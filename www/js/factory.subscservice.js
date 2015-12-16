/**
 * @ngdoc service
 * @name starter.services.SubscriptionService
 * @description Subscription service
 * @requires [$http]
 * @author nthusitha
 * @since 0.0.1
 */
angular.module('starter.services').factory('SubscriptionService', SubscriptionService);

SubscriptionService.$inject = [ '$http' ];

function SubscriptionService($http) {

	var $q_;

	/*
	 * ============== SCOUT PHASE 2 =============
	 * 
	 */

	/*
	 * Common save subscription handler.
	 */
	function writeSubscriptions_($http, co, authToken, mode) {

		var fingerprint = "";
		if ($http && co && authToken) {
			var url = weather_config.gtnx_url + "/" + weather_config.gtnx_subscription_global_type + "/" + co.uid + "?datakey="
					+ weather_config.gtnx_dataKey;

			if (co.__metadata) {
				delete co.__metadata;
			}
			if (co.fingerprint) {
				fingerprint = co.fingerprint;
			} else {
				throw "can't proceed without fingerprint";
			}

			var postReq = {
				method : 'POST',
				data : JSON.stringify(co),
				url : url,
				headers : {
					'If-Match' : fingerprint,
					'Authorization' : authToken,
					'Access-Control-Allow-Origin' : '*',
					'Content-Type' : 'application/json'
				}
			}

			return $http(postReq).then(function(result) { // success

				console.log("Success persisting subscriptions" + JSON.stringify(result));
				var result_ = result.data;
				console.log("inside success call back " + JSON.stringify(result));
				var response = new Object();
				if (mode == 'CREATE') {
					// not required.
					// response.platformSubscriberId = result_.uid;
					// response.platformSubId =
					// result_.platformSubscriptions[result_.platformSubscriptions.length
					// - 1].uid;
				}
				response.status = "ok";
				response.subscriptions = result_;
				return response;

			}, function(e) { // error console.log("Error " +
				console.log("Error persisting subscriptions" + JSON.stringify(e));
				var result = e;
				var response = new Object();
				response.status = "error";
				return response;
			});

		}

	}

	/*
	 * This method depends on a promise returned by the writeSubscriptions_
	 * method. Extract platformSubscriberId & platformSubId from the promise and
	 * populate MSubscription and call this method.
	 * 
	 */
	function createSubscriptionInMiddleServer_($http, mSubscription) {
		var url = weather_config.weather_server + weather_config.create_sub_url;

		// TODO: Sync Middle Server.
		if (mSubscription.length > 0) {

			var postReq = {
				method : 'POST',
				data : JSON.stringify(mSubscription),
				url : url
			}

			return $http(postReq).then(function(result) { // success
				console.log("inside success call back " + JSON.stringify(result));
				console.log("Success persisting subscriptions in middle server" + JSON.stringify(result));

				var response = new Object();

				response.status = "ok";
				return response;

			}, function(e) { // error console.log("Error " +
				console.log("Error persisting subscriptions in middle server" + JSON.stringify(e));
				var result = e;
				var response = new Object();
				response.status = "error";
				return response;
			});

		} else {
			throw "invalid promise, createSubscriptionInMidleServer operation failed";
		}

	}

	/*
	 * MSubscription's following properties are mandatory; platformSubscriberId,
	 * platformSubId, active.
	 * 
	 * active - boolean {true - enable subscription/ false -disable
	 * subscription}
	 * 
	 */
	function toogleSubscriptionInMiddleServer_($http, platformSubscriberId, platformSubId, activate) {
		if ($http && platformSubscriberId && platformSubId) {
			var subscToggleUrl = weather_config.weather_server + weather_config.middle_server_subscToggle_url + "?subscriberUid="
					+ platformSubscriberId + "&subscriptionUid=" + platformSubId + "&activate=" + activate;

			var postReq = {
				method : 'POST',
				url : subscToggleUrl
			}

			return $http(postReq).then(function(result) { // success
				console.log("inside toogleSubsc success call back " + JSON.stringify(result));
				var response = new Object();

				response.status = "ok";
				return response;

			}, function(e) { // error console.log("Error " +
				console.log("Error persisting subscriptions in middle server" + JSON.stringify(e));
				var result = e;
				var response = new Object();
				response.status = "error";
				return response;
			});
		} else {
			throw "illegal aruments, unable to toggle subscriptions";
		}

	}

	/*
	 * Remove subscription from the middle server. Invoke this method when user
	 * don't want to get alerts for the given location.
	 */
	function removeSubscriptionInMiddleServer_($http, platformSubscriberId, platformSubscripitonId) {

		if ($http && platformSubscriberId && platformSubscripitonId) {
			var purgeSubscUrl = weather_config.weather_server + weather_config.middle_server_purge_subsc_url + "?subscriberUid="
					+ platformSubscriberId + "&subscriptionUid=" + platformSubscripitonId;

			var postReq = {
				method : 'POST',
				url : purgeSubscUrl
			}

			return $http(postReq).then(function(result) { // success
				console.log("inside purge subsc success call back " + JSON.stringify(result));
				var response = new Object();

				response.status = "ok";
				return response;

			}, function(e) { // error console.log("Error " +
				console.log("Error persisting subscriptions in middle server" + JSON.stringify(e));
				var result = e;
				var response = new Object();
				response.status = "error";
				return response;
			});

		}

	}

	function getSubscriptionByUid($http, authToken) {
		// TODO: Get the entire $platformSubscriber from the platform via custom
		// objects.. Re-use the code to fetch $platformSubscriber data after
		// successful login.
	}

	/*
	 * Sample Subskription { "uid": "210755881", "uIdentifier": "200720141",
	 * "watchedFactory":{"partyRoleCode": "ReceivedFrom",
	 * "address":{"countryCode": "US", "stateOrProvince": "New York",…} }
	 * 
	 * co - existing co (witout incoming modification)
	 * 
	 * subskription - CSubscription - New Subscription user want to create.
	 * 
	 * 
	 * Note: Caller need to make sure before calling this call, no duplicate
	 * subscriptions are added.
	 * 
	 */
	function createSubscription($http, co, subskription, authToken, mode) {
		// TODO: Create subscriptions in the platform & update complimentary
		// data in
		// in the
		// middle server.

		if ($http && co && subskription && authToken) {
			var subskriber = co;
			var existingSubskription = [];
			if (co.platformSubscriptions && co.platformSubscriptions.length > 0) {

				for (var i = 0; i < subskription.length; i++) {
					if (subskription[i].watchedFactory && subskription[i].uIdentifier) {

						co.platformSubscriptions.push(subskription[i]);
					}
				}

			} else {
				co.platformSubscriptions = [];
				for (var i = 0; i < subskription.length; i++) {
					if (subskription[i].watchedFactory && subskription[i].uIdentifier) {

						co.platformSubscriptions.push(subskription[i]);
					}
				}

			}
			return writeSubscriptions_($http, co, authToken, mode);

		} else throw "Illegal argument, unable to create subscription!!";

	}

	/*
	 * function editSubscription($http, co, authToken) { // simple update to co.
	 * return writeSubscriptions_($http, co, authToken); }
	 */

	/*
	 * 
	 * co - Existing co (without incoming modification)
	 * 
	 * subskription - Subscription you want to remove from the co.
	 * 
	 * 
	 */
	function deleteSubscription_($http, co, subskription, authToken) {
		// TODO: Delete from Middle Server

		return writeSubscriptions_($http, co, authToken);
		// TODO: Incorporate removeSubscriptionInMiddleServer_ with this method.
	}

	// ===================

	// **function to create the Msubscription array
	/*
	 * 
	 * promise - respone from the CO create/update call
	 * 
	 * subsckirption - [] of newly add subscriptions.
	 */

	function createMSubcriptionArray_($http, promise, subskription, severity) {
		var responseObj = promise.subscriptions;
		var subscriberObj = responseObj.data;
		var platformSubscriberId = subscriberObj.uid;
		var subscriptionsArray = subscriberObj.platformSubscriptions;

		var SubscriptionArrayLength = subscriptionsArray.length;
		// Logic is if total length is 7
		// and subskription.length is 2
		// so the Newly added objects are in the 5 and 6th places/////
		var k = 0;

		console.log("gettting address Obj");
		console.log(subscriptionsArray);

		var platformSubIds = new Array();
		var platformLocations = new Array();

		var ArrayStart = SubscriptionArrayLength - (subskription.length);

		// array to store the Msubscriptions
		var mSubscriptionsArray = new Array();
		var httpGetRequests = [];
		var url = weather_config.google_map_javascript_api_url;

		for (var i = ArrayStart; i < subscriptionsArray.length; i++) {
			var mSubscription = new MSubscription();
			platformSubIds[k] = subscriptionsArray[i].uid;

			var mSubscription = new MSubscription();
			mSubscription.platformSubscriberId = platformSubscriberId;
			mSubscription.platformSubId = subscriptionsArray[i].uid;
			// list of MLocation
			var locationObj = new Object();
			locationObj.city = subscriptionsArray[i].watchedFactory.address.city;
			locationObj.country = subscriptionsArray[i].watchedFactory.address.countryCode;
			locationObj.postcode = subscriptionsArray[i].watchedFactory.address.postalCodeNumber;
			locationObj.serviceProvider = "YAHOO";
			locationObj.active = true;
			mSubscription.location=locationObj;
			
			var addressobj = subscriptionsArray[i].watchedFactory.address;

			var addressString = addressobj.addressLine1 + " " + addressobj.city + " " + addressobj.countryCode + " "
					+ addressobj.postalCodeNumber + " " + addressobj.stateOrProvince;

			var getReq = {
				method : 'GET',
				url : url,
				headers : {
					'Access-Control-Allow-Origin' : '*',
					'Content-Type' : 'application/json'
				},
				params : {
					address : addressString,
					sensor : false
				}
			}
			httpGetRequests.push($http(getReq));
			// fetching long,lat from google map API.
			/*
			 * googleMapGeoCode($http, addressString).then(function(res) {
			 * console.log("Inside map API"); if (res.status == "ok") {
			 * console.log(res.cordinates.data.results[0].geometry.location.lat);
			 * locationObj.city = addressobj.city; locationObj.country =
			 * addressobj.countryCode; locationObj.postcode =
			 * addressobj.postalCodeNumber; locationObj.lat =
			 * res.cordinates.data.results[0].geometry.location.lat;
			 * locationObj.lon =
			 * res.cordinates.data.results[0].geometry.location.lng;
			 * locationObj.serviceProvider = "yahoo"; locationObj.active = true;
			 * mSubscription.location = locationObj; } });
			 */

			mSubscription.device = new Object();
			//mSubscription.severity = "LEVEL_10";
			mSubscription.severity = severity;
			
			mSubscription.interval = "60";
			var pushdId = localStorage.getItem(weather_config.local_storage_pushd_subscriber_id_key);
			mSubscription.pushdSubId = pushdId;
			mSubscription.startDate = new Date();
			mSubscription.endDate = null;

			mSubscriptionsArray.push(mSubscription);

			k++;

		}

		return chainHttpRequsts_(httpGetRequests).then(function(res) {
			console.log("bulk map requests");

			for (var i = 0; i < mSubscriptionsArray.length; i++) {

				if (res[i].statusText == "OK") {

					/*var locationObj = new Object();
					locationObj.city = addressobj.city;
					locationObj.country = addressobj.countryCode;
					locationObj.postcode = addressobj.postalCodeNumber;
					locationObj.serviceProvider = "YAHOO";
					locationObj.active = true;*/
					// check if there are results (lat, long values) from google
					// maps conversion
					if (res[i].data.results.length > 0) {

						console.log(res[i].data.results[0].geometry.location.lat);
						//locationObj.lat = res[i].data.results[0].geometry.location.lat;
						//locationObj.lon = res[i].data.results[0].geometry.location.lng;
						mSubscriptionsArray[i].location.lat=res[i].data.results[0].geometry.location.lat;
						mSubscriptionsArray[i].location.lon=res[i].data.results[0].geometry.location.lng;
					} else {
						// if there are no lat,lon from google, harcode to 0
						mSubscriptionsArray[i].location.lat= 0;
						mSubscriptionsArray[i].location.lon= 0;

					}

					//mSubscriptionsArray[i].location = locationObj;

				}
			}
			return mSubscriptionsArray;

		});

	}

	/*
	 * Chain promises. And aggregate results. Call .then() on the return promise
	 * to access the geoLoations[].
	 */
	function chainHttpRequsts_(requests) {
		return $q_.all(requests).then(function(result) {
			// result contains all geocoded respones (lat, lon) values of each
			// requests.
			var geoLocations = [];
			angular.forEach(result, function(value) {
				geoLocations.push(value);
			});
			return geoLocations;
		});

	}

	// ********************************************

	/* function to load the initial state of sunbscriptions */

	function loadSubscriptionState_($http, subscriptionArray) {

		if ($http && subscriptionArray) {
			var url = weather_config.weather_server + weather_config.middle_server_subscToggle_state_url;

			var getReq = {
				method : 'POST',
				url : url,
				data : subscriptionArray
			}

			return $http(getReq).then(function(result) { // success
				console.log("inside purge subsc success call back " + JSON.stringify(result));
				var response = new Object();

				response.status = "OK";
				response.data = result;
				return response;

			}, function(e) { // error console.log("Error " +
				console.log("Error persisting subscriptions in middle server" + JSON.stringify(e));
				var result = e;
				var response = new Object();
				response.status = "error";
				return response;
			});

		}

	}

	/* End of load subscription state */

	return {
		getSubsc : function($http) {
			try {

				return getSubsc($http).then(function(res) {
					console.log("inside 'SubsService' factory " + JSON.stringify(res));
					return res;
				})
			} catch (err) {
				if (weather_config.debug) {
					console.log("error occured fetching subsciptions" + "\n" + err);
				}
			}

		},
		createSubsription : function($q, $http, co, subskription, authToken, severity) {
			// TODO: Initialise variables with correct state.

			// var co = subskription = authToken = new Object();

			//
			$q_ = $q;
			var severity_ = severity;
			console.log(co);
			console.log("Total count");
			console.log(subskription.length);

			return createSubscription($http, co, subskription, authToken, 'CREATE').then(function(promise) {

				if (promise.status = 'ok') {
					createMSubcriptionArray_($http, promise, subskription, severity_).then(function(res) {
						console.log(res);
						return createSubscriptionInMiddleServer_($http, res);
					});
				}

				// mSubscription.platformSubscriberId =
				// promise.platformSubscriberId;
				// mSubscription.platformSubId = promise.platformSubId;

			});
		},
		createMSubcriptionArray : function($http, promise, subskription) {
			return createMSubcriptionArray_($http, promise, subskription);
		},
		deleteSubscription : function($http, co, subskription, authToken) {
			return deleteSubscription_($http, co, subskription, authToken);
		},
		toogleSubscription : function($http, platformSubscriberId, platformSubId, activate) {
			return toogleSubscriptionInMiddleServer_($http, platformSubscriberId, platformSubId, activate);
		},
		removeSubscriptionMiddleServer : function($http, platformSubscriberId, platformSubId) {
			return removeSubscriptionInMiddleServer_($http, platformSubscriberId, platformSubId);
		},
		updatePlatformSubscriberObject : function($http, co,authToken) {
			return writeSubscriptions_($http, co, authToken, 'CREATE');
		},
		checkSubscriptionState : function($http, subscriptionArray) {
			return loadSubscriptionState_($http, subscriptionArray);
		},
		chainHttpRequsts : function($q,httpRequests) {
			$q_ = $q;
			return chainHttpRequsts_(httpRequests);
		}

	}
}