/**
 * @ngdoc function
 * @name getPartyList
 * @description Get party list
 * @returns {$http} promise containing HTTP request
 * @author nthusitha
 * @since 0.0.1
 */
function getPartyList($http) {

	var url = weather_config.gtnx_url + weather_config.gtnx_party_list_uri + weather_config.gtnx_dataKey;

	var auth = new Object();
	var partyList;

	var url = url;

	var authToken = localStorage.getItem(weather_config.local_storage_auth_token_key);

	var getReq = {
		method : 'GET',
		url : url,
		headers : {
			'Authorization' : authToken,
			'Access-Control-Allow-Origin' : '*',
			'Content-Type' : 'application/json'
		}
	}

	return $http(getReq).then(function(result) {
		// success

		console.log("Success raw" + JSON.stringify(result));
		var result = result.data.result;
		console.log("inside success call back " + JSON.stringify(result));
		var response = new Object();
		response.status = "ok";
		response.partyList = result;
		return response;

	}, function(e) {
		// error
		console.log("Error " + JSON.stringify(e));
		var result = e;
		var response = new Object();
		response.status = "error";
		return response;

	});

}

/**
 * @ngdoc function
 * @name fetchPartyListForMap_
 * @description Get party list for map
 * @returns {$http} promise containing HTTP request
 * @author nthusitha
 * @since 0.0.1
 */
function fetchPartyListForMap_($http,orgId){
	var basicToken = encodeHeader(weather_config.admin_userName, weather_config.admin_password);
	var authToken = basicToken;
	var url = weather_config.gtnx_url + "/" + weather_config.org_info_design;
	var oqlStatement = 'orgId="'+orgId+'"';
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
			dataKey : weather_config.gtnx_dataKey,
			oql : oqlStatement
		}
	}

	return $http(req);
}


/**
 * @ngdoc function
 * @name findOrgForLoggedUser_
 * @description Get org for logged in user
 * @returns {$http} promise containing HTTP request
 * @author nthusitha
 * @since 0.0.1
 */
function findOrgForLoggedUser_($http){
	
	var authToken = localStorage.getItem(weather_config.local_storage_auth_token_key);
	var url = weather_config.gtnx_url + "/" + weather_config.get_logged_user_url;
	
	var req = {
		method : 'GET',
		url : url,
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
	//return "3717-9890-1802-4131";
}

/*

 */

/**
 * @ngdoc function
 * @name interceptObjectArray
 * @description  Intercept object array and inject new attributes. This is usefull when
 * injecting properties in order to make UI handling much easier. i.e. To find
 * user selected object from a selection etc.
 * @returns {[Array]} Resultant array containing objects consisting new attributes.
 * @since 0.0.1
 */
function interceptObjectArray(sourceArray, newAttribute, defaultVal) {

	var targetArray = [];
	if (sourceArray && newAttribute && defaultVal != null) {

		for (i = 0; i < sourceArray.length - 1; i++) {
			var copy = sourceArray[i];
			copy[newAttribute] = defaultVal;
			targetArray.push(copy);
		}

		return targetArray;

	} else {
		throw "illegal argument exception";
	}
}


