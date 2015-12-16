/**
 * @ngdoc function
 * @name starter.controllers.MapsController
 * @description Controlls the map in the main page
 * @requires [$scope, Alerts, $ionicScrollDelegate, PartyService, $http, $ionicLoading, $state,
	NotificationService, SubscriptionService, $q, $timeout, uiGmapIsReady]
 * @since 0.0.1
 */
angular.module('starter.controllers').controller('MapsController', MapsController);

MapsController.$inject = [ '$scope', 'Alerts', '$ionicScrollDelegate', 'PartyService', '$http', '$ionicLoading',
	'$state', 'NotificationService', 'SubscriptionService', '$q', '$timeout', 'uiGmapIsReady' ];

function MapsController($scope, Alerts, $ionicScrollDelegate, PartyService, $http, $ionicLoading, $state,
	NotificationService, SubscriptionService, $q, $timeout, uiGmapIsReady) {

	$ionicLoading.show({
		content : 'Loading!',
		animation : 'fade-in',
		showBackdrop : true,
		maxWidth : 400,
		showDelay : 0
	});

	$scope.map = {
		center : {
			latitude : 40.1451,
			longitude : -99.6680
		},
		zoom : 3
	};
	$scope.options = {
		scrollwheel : false,
		maxWidth : '100%'
	};
	var symbolScale = 8;
	$scope.customIcon = {
		path : google.maps.SymbolPath.CIRCLE,
		scale : symbolScale,
		fillOpacity : 0.5,
		fillColor : '#00CC66',
		strokeOpacity : 0.9,
		strokeColor : '#375C12',
		strokeWeight : 2
	};
	$scope.customIcon2 = {
		path : google.maps.SymbolPath.CIRCLE,
		scale : symbolScale,
		fillOpacity : 0.5,
		fillColor : '#c13236',
		strokeOpacity : 0.9,
		strokeColor : '#c13236',
		strokeWeight : 2
	};
	$scope.marker = {
		coords : {
			latitude : 40.1451,
			longitude : -99.6680
		},
		show : false,
		id : 0
	};

	// code for anguler UI maps
	var styles = [
	/*
	 * { stylers: [ { hue: "#00ffe6" }, { saturation: -20 } ] },
	 */

	{
		featureType : "water",
		elementType : "all",
		stylers : [

		{
			color : "#1c334b"
		}, {
			saturation : 0
		} ]
	}, {
		featureType : "road",
		elementType : "labels",
		stylers : [ {
			visibility : "off"
		} ]
	}, {
		featureType : "landscape.natural.landcover",
		elementType : "all",
		stylers : [ {
			color : "#daddd6"
		},
		/* { hue : "#aaff00" }, */
		{
			saturation : 0
		}

		]
	}, {
		featureType : "landscape.natural.terrain",
		elementType : "all",
		stylers : [ {
			color : "#daddd6"
		}, {
			hue : "#aaff00"
		}, {
			saturation : -22
		}

		]
	} /*
			 * ,{ featureType: "landscape.natural", elementType: "geometry.fill", stylers: [ { color:
			 * "#f3ffea" }, { saturation : 1 } ] }
			 */
	];

	uiGmapIsReady.promise(1).then(function(instances) {
		instances.forEach(function(inst) {
			var map = inst.map;
			var uuid = map.uiGmap_id;
			var mapInstanceNumber = inst.instance; // Starts at 1.
			// $scope.map = map;
			console.log("print map");
			console.log(map);

			// MAP options
			map.setOptions({
				styles : styles,
				minZoom : 2,
				maxZoom : 6,
				mapTypeControl : false,

				panControl : false,
				streetViewControl : false,
				zoomControl : false,
				zoomControlOptions : {
					style : google.maps.ZoomControlStyle.LARGE,
					position : google.maps.ControlPosition.LEFT_CENTER
				}

			});

		});
		

	});

	$scope.locations = "";
	// code code anguler map

	var httpGetRequests = [];
	var partyListArray = [];
	var url = weather_config.google_map_javascript_api_url;
	$scope.infoWindowTrigger = true;
	// service call to find the logged user Org.
	PartyService.findOrgForLoggedUser($http).then(function(orgObj) {

		if (orgObj.status == 200) {
			console.log("orgObj");
			console.log(orgObj);
			// service call to find the communitites of the Org id.
			// communities will be returned as a emebeded object.
			var orgId = orgObj.data.organizationUid;
			PartyService.fetchPartyListForMap($http, orgId).then(function(res) {
				if (res.status == 200) {
					console.log("Printing  partylist for maps");
					var comObjectsArray = new Array();
					//handle no data case
					if(res.data.result){

					console.log(res.data.result[0].community);
					
					comObjectsArray = res.data.result[0].community;
					// validating userobject already subsscribed.
					$scope.userObject = JSON.parse(localStorage.getItem(weather_config.local_storage_platform_susbscirber_json_key));

					for (var i = 0; i < comObjectsArray.length; i++) {
						if (comObjectsArray[i].hasOwnProperty("latitude") && comObjectsArray[i].hasOwnProperty("longitude")) {
							comObjectsArray[i].coords = {
								latitude : comObjectsArray[i].latitude,
								longitude : comObjectsArray[i].longitude
							};
						}
						comObjectsArray[i].options = {
							labelContent : comObjectsArray[i].sellerOrgname,
							labelClass : 'labels'
						};
						comObjectsArray[i].name = comObjectsArray[i].sellerOrgname;
						console.log($scope.userObject);

						//comObjectsArray[i].chkList = false;

						// check the orgId's have '-' seprators
						var indexOfDash = (comObjectsArray[i].sellerOrgId).indexOf("-");
						// console.log("index of dash");
						// console.log(indexOfDash);
						var formattedOrgId = comObjectsArray[i].sellerOrgId;
						if (indexOfDash > 0) {
							var arrayOfOrgId = (comObjectsArray[i].sellerOrgId).split("-");
							formattedOrgId = "";
							for (var j = 0; j < arrayOfOrgId.length; j++) {
								formattedOrgId = "" + formattedOrgId + arrayOfOrgId[j];
							}

						}

						// compare the org id is already subscribed.
						comObjectsArray[i].chkList = false;
						comObjectsArray[i].icon = $scope.customIcon2;
						if ($scope.userObject.platformSubscriptions && $scope.userObject.platformSubscriptions.length > 0) {
							for (var k = 0; k < $scope.userObject.platformSubscriptions.length; k++) {
								// console.log("Compairing :
								// "+formattedOrgId+" with
								// "+$scope.userObject.platformSubscriptions[k].watchedFactory.memberId);
								if (formattedOrgId == $scope.userObject.platformSubscriptions[k].watchedFactory.memberId) {
									comObjectsArray[i].chkList = true;
									comObjectsArray[i].icon = $scope.customIcon;

									// console.log("found org id :
									// "+formattedOrgId);
								} else {
									// comObjectsArray[i].chkList =
									// false;
								}
							}
						}
					}
					}else{

						if(weather_config.debug){
							console.log("No custom object data found for community list locations");
						}
					}


					$scope.locations = comObjectsArray;
					// hide the loading

					$ionicLoading.hide();
					
					handleAnchorsInGoogleMap();
				}
			});

		}

	});
	// SHOW MESSASGE
	$scope.showMessage = function(message) {
		var msg = document.getElementById('showError');
		move(msg).delay('0.2s').ease('in').y('180').end();
		$scope.displayError = message;
	}

	// HIDE MESSAGE
	$scope.hideMessge = function() {
		var msg = document.getElementById('showError');
		move(msg).delay('0.3s').ease('in').y('-180').end();
		$scope.displayError = "";
	}

	$scope.getIcon = function(partyObj) {

		if (partyObj.chkList) {
			return $scope.customIcon;
		} else {
			return $scope.customIcon2;
		}
	};

	$scope.filterType = "";
	$scope.filterTypeValidation = function(id) {
		console.log($scope.map.markers);
		console.log($scope.map);

		/*
		 * for(var key in $scope.map.markers){
		 * 
		 * if($scope.map.markers[key].hasOwnProperty('infoWindows')){
		 * $scope.map.markers[key].infoWindows.setMap(null); } }
		 */

		var count = $scope.filterTypes;
		for (var i = 0; i < count.length; i++) {
			if (($scope.filterTypes[i].id == id) && ($scope.filterTypes[i].enabled)) {
				if ($scope.filterTypes[i].value == 'All') {
					$scope.filterType = "";
				} else {
					$scope.filterType = $scope.filterTypes[i].value;
				}

			} else {
				$scope.filterTypes[i].enabled = false;
			}
		}

		/*
		 * console.log($scope.map); var total= new Object(); total=$scope.map.markers;
		 * 
		 * if( $scope.map.markers.hasOwnProperty('0')){ console.log("im in undefind"); }else{
		 * console.log("im in not undefind");
		 * 
		 * //$timeout(function(){$scope.loadInfoWindows();} ,500); }
		 */
	};
	


	$scope.showAlertWindow = function() {
		$state.go('tab.alerts');
	};
	$scope.statusesArray = "";
	$scope.loadInformation = function(org) {
		$scope.showMessage(org.address);
	}
	$scope.ScoialInfoMessage = "";
	$scope.myHTML = ""
	$scope.markerClicked = function(org) {
		$scope.statusesArray = "";
		$scope.subsStatus = "";
		$scope.ScoialInfoMessage = "";
		$scope.myHTML = "";
		// $scope.showMessage(org.address);
		if (org.chkList) {
			$scope.subsStatus = "ON";
		} else {
			$scope.subsStatus = "OFF";
		}
		var address = org.address;
		$scope.showMessage(org.address);
		var resAddress = address.split(",");
		var addressFormat = resAddress[2] + ", " + resAddress[4];
		console.log(org.address);
		Alerts.fetchSocialInfo($http, addressFormat).then(
			function(res) {
				// console.log(res);

				if (res.data.hasOwnProperty('statuses')) {
					for (var k = 0; k < res.data.statuses.length; k++) {
						var htmlString = "<li>"
							+ res.data.statuses[k].text.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g,
								'<a href="$1" class="socialfeed">$1</a> ') + "</li>";

						//var regx = /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g;
					//	var result = regx.exex(res.data.statuses[k].text);
						
						/*
						$scope.myHTML = "";
						$scope.$watch('myHTML', 	function(){
							
						});
						*/
						$scope.myHTML = $scope.myHTML + htmlString;
						
						//global fn
					
						// res.data.statuses[k].url=
					}

					$scope.statusesArray = res.data.statuses;
					console.log($scope.statusesArray);
				} else {
					$scope.ScoialInfoMessage = "Currently No Social Messages...";
				}
				//must do apply here as the change to myHTML is not appearing in the markup.
				$scope.$apply();
				initInAppBrowser();

			});

	}
	
	
}