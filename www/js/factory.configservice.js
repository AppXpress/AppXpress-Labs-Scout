/**
 * @ngdoc service
 * @name starter.services.ConfigService
 * @description App configruation services i.e.. Do not disturb, Service provider selection,
 * GTNX environment selection methods should go here.
 * @author nthusitha
 * @since 0.0.1
 */
angular.module('starter.services').factory('ConfigService', ConfigService);

/*******************************************************************************
 * * / App configruation services i.e.. Do not disturb, Service provider
 * selection, GTNX environment selection methods should go here.
 * 
 * 
 * 
 */
function ConfigService() {

	return {
		/*
		 * device - <MDevice>. Following are mandatory; platformSubscriberId,
		 * pushdSubscriberId, doNotDisturb(boolean)
		 */
		turnOnDoNotDisturb : function($http, device) {
			if ($http && device) {

				var doNotDisturbUrl = weather_config.weather_server + weather_config.middle_server_donot_disturb_url;
				var postReq = {
					method : 'POST',
					data : JSON.stringify(device),
					url : doNotDisturbUrl
				}

				return $http(postReq).then(function(result) { // success
					console.log("inside turnOnDoNotDisturb success call back " + JSON.stringify(result));
					var response = new Object();

					response.status = "ok";
					return response;

				}, function(e) { // error console.log("Error " +
					console.log("Error in turnOnDoNotDisturb" + JSON.stringify(e));
					var result = e;
					var response = new Object();
					response.status = "error";
					return response;
				});
			} else {
				throw "illegal argument exception";
			}

		},
		/*
		 * device - <MDevice> The device platform, deviceToken &
		 * platformSubscriberId is mandatory.
		 */
		turnOffDoNotDisturb : function($http, device) {
			if ($http && device) {

				var registerUrl = weather_config.weather_server + weather_config.middle_server_device_register_url;
				var postReq = {
					method : 'POST',
					data : JSON.stringify(device),
					url : registerUrl
				}

				return $http(postReq).then(function(result) { // success
					console.log("inside turnOffDoNotDisturb success call back " + JSON.stringify(result));
					var response = new Object();

					response.status = "ok";
					return response;

				}, function(e) { // error console.log("Error " +
					console.log("Error in turnOffDoNotDisturb" + JSON.stringify(e));
					var result = e;
					var response = new Object();
					response.status = "error";
					return response;
				});
			} else {
				throw "illegal arguemnt exception";
			}
		}
	}

}