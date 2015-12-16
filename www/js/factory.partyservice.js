/**
 * @ngdoc service
 * @name starter.services.PartyService
 * @description Party service
 * @requires [$http]
 * @author nthusitha
 * @since 0.0.1
 */
angular.module('starter.services').factory('PartyService', PartyService);

PartyService.$inject = [ '$http' ];

function PartyService($http) {
	var partyList = null;
	var PartyListForMap = null;
	var loggedUserOrg = null;
	var $http_ = $http;

	/*
	 * Return subscription state for each party. (party in either subscribedList or
	 * unsubscribedList) Anyway this has been already implemented it seems.
	 * 
	 */
	function getSubscriptionMode_() {

		var subscriber = localStorage.getItem(weather_config.local_storage_platform_susbscirber_json_key);
		var subscriptions = subscriber.platformSubscriptions;
		var partyListRes = getPartyList($http);
		var partyList = partyListRes.result;

		var unsubscribedPartyList = [];
		var subscribedPartyList = [];

		if (weather_config.debug) {
			console.log("interating through the party list to find subscribed/nonsubscribed locations");
		}
		angular.forEach(partyList, function(party, key) {

			if (weather_config.debug) {
				console.log("current party memeber is " + party.memberId);
			}
			var hitCount = 0;
			var breakCircuit = false;
			angular.forEach(subscriptions, function(sub, key) {

				if (!breakCircuit) {
					if (party.memberId == sub.watchedFactory.memberId) {
						breakCircuit = true;
					} else {
						// no match found
						hitCount++;
						// nothing found in the entire subscriptions array
						if (hitCount == (subscriptions.length - 1)) {
							if (weather_config.debug) {
								console.log("current party memeber " + party.memberId + " doesn't have subscriptions");
							}
							this.push(party);
							breakCircuit = true;
						}
					}
				}

			}, unsubscribedPartyList);

		});

		angular.forEach(subscriptions, function(sub, value) {

			this.push(sub.watchedFactory);

		}, subscribedPartyList);

		var mode = new Object();
		mode.subscribedList = subscribedPartyList;
		mode.unsubscribedList = unsubscribedPartyList;
		return mode;

	}

	return {
		getPartyList : function($http) {
			// getPartyList is defined as a global fn in party.js (for backward compatibility)
			partyList = getPartyList($http).then(function(res) {
				// console.log("inside service response call back" +
				// JSON.stringify(res));
				return res;
			});
			return partyList;
		},
		fetchPartyList : function() {
			// console.log("returning party List" +
			// JSON.stringify(partyList));

			if (partyList != null) {
				return partyList;
			} else {
				return getPartyList($http);
			}

		},
		fetchPartyListForMap : function($http, orgId) {
			PartyListForMap = fetchPartyListForMap_($http, orgId);
			return PartyListForMap;
		},
		findOrgForLoggedUser : function($http) {
			loggedUserOrg = findOrgForLoggedUser_($http)
			return loggedUserOrg;
		},
		getSubscriptionMode : function() {
			return getSubscriptionMode_();
		}
	};
}