angular.module('starter.services')

/*
 * .config([ '$httpProvider', function($httpProvider) {
 * $httpProvider.interceptors.push('myHttpResponseInterceptor'); } ])
 */

/*
 * .factory('myHttpResponseInterceptor', [ '$q', '$location', function($q,
 * $location) { return { response : function(response) { return
 * promise.then(function success(response) { return response; }, function
 * error(response) { if (response.status === 401) { $location.path('/signin');
 * return $q.reject(response); } else { return $q.reject(response); } }); } } } ])
 */

.factory('handleResponse', function($http) {

	return {
		success : function(data, status, headers) {
			console.log("success");
		},
		error : function(data, status, headers) {
			console.log("Error");
		}
	}

})// service for login UI
.factory('loginService', function($http) {

	return {
		login : function(object) {

			var authToken = encodeHeader(object.userName, object.password, object.eid);
			console.log(authToken);
			// service call for angular

			var req = {
				method : 'GET',
				url : weather_config.gtnx_url,
				headers : {
					'Authorization' : authToken,
					'Access-Control-Allow-Origin' : '*',
					'Content-Type' : weather_config.content_type
				},
				params : {
					dataKey : weather_config.gtnx_dataKey
				}
			}

			return $http(req);
		},
		/* Get current user details (including org data) using /self */
		getUserDetails : function(authToken){

			var selfUrl = weather_config.gtnx_url + weather_config.gtnx_self;

			var req = {
				method : 'GET',
				url : selfUrl,
				headers : {
					'Authorization' : authToken,
					'Access-Control-Allow-Origin' : '*',
					'Content-Type' : weather_config.content_type
				},
				params : {
					dataKey : weather_config.gtnx_dataKey
				}
			}
			return $http(req);

		}
	}
})

// code for service to fetch objects by oql
// TODO: Can we please make this a proper service with proper names?
.factory('oqlService', function($http) {

	return {
		findObjByOql : function(userName, designName, oqlStatement) {

			// service call for angular
			var url = weather_config.gtnx_url + designName;
			var softwareProviderDataKey = weather_config.gtnx_dataKey;
			// var oqlStatement = 'userName = "' + userName + '"';
			var req = {
				method : 'GET',
				url : url,
				headers : {
					'Authorization' : weather_config.authToken,
					'Access-Control-Allow-Origin' : '*',
					'Content-Type' : weather_config.content_type
				},
				params : {
					dataKey : softwareProviderDataKey,
					oql : oqlStatement
				}
			}

			return $http(req);

		}
	}

})

// code for User services
.factory('platformSubscriberService', function($http) {
	var authToken = localStorage.getItem(weather_config.local_storage_auth_token_key);
	return {
		findUser : function(userName, authToken) {

			// service call for angular
			var url = weather_config.gtnx_url + "/" + weather_config.gtnx_subscription_global_type;
			var softwareProviderDataKey = weather_config.gtnx_dataKey;
			var oqlStatement = 'username = "' + userName + '" and status="active"';
			console.log(oqlStatement);
			var req = {
				method : 'GET',
				url : url,
				headers : {
					'Authorization' : authToken,
					'Access-Control-Allow-Origin' : '*',
					'Content-Type' : weather_config.content_type
				},
				params : {
					dataKey : softwareProviderDataKey,
					oql : oqlStatement
				},
				cache : false
			}

			return $http(req);

		},
		getSubscriberDetails : function(subUid, authToken){
			
			// service call for angular
			var url = weather_config.gtnx_url + "/" + weather_config.gtnx_subscription_global_type + "/" + subUid;
			var softwareProviderDataKey = weather_config.gtnx_dataKey;
			//console.log(oqlStatement);
			var req = {
				method : 'GET',
				url : url,
				headers : {
					'Authorization' : authToken,
					'Access-Control-Allow-Origin' : '*',
					'Content-Type' : weather_config.content_type
				},
				params : {
					dataKey : softwareProviderDataKey
				},
				cache : false
			}

			return $http(req);
		
		},
		createUser : function(userObj, authToken) {
			// service call for angular
			var url = weather_config.gtnx_url + "/" + weather_config.gtnx_subscription_global_type;
			var softwareProviderDataKey = weather_config.gtnx_dataKey;
			var req = {
				method : 'POST',
				url : url,
				headers : {
					'Authorization' : authToken,
					'Access-Control-Allow-Origin' : '*',
					'Content-Type' : weather_config.content_type
				},
				params : {
					dataKey : softwareProviderDataKey
				},
				data : JSON.stringify(userObj)
			}

			return $http(req);

		}
	}

});
