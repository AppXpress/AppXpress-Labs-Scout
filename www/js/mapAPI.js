/**
 * @ngdoc function
 * @name googleMapGeoCode
 * @description Fetchdatafrom from Google map API 
 * @since 0.0.1
 */
function googleMapGeoCode($http,addressString) {

	var url = weather_config.google_map_javascript_api_url;

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

	return $http(getReq).then(function(r) { // success
console.log(r);
	/*	var result = r.data.result;

		console.log("subscription req is sucess, respone raw" + "\n" + JSON.stringify(result));*/
		var response = new Object();
		response.status = "ok";
		response.cordinates = r;
		return response;

	}, function(e) { // error console.log("Error " +
		JSON.stringify(e);
		var result = e;
		var response = new Object();
		response.status = "error";
		console.log(response);
		return response;

	});

}