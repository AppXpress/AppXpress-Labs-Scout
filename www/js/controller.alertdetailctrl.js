/**
 * @ngdoc function
 * @name starter.controllers.AlertDetailController
 * @description Alert detail controller
 * @requires [$scope, $rootScope, $stateParams, $cordovaEmailComposer, $filter, $ionicLoading, Alerts]
 * @since 0.0.1
 */
angular.module('starter.controllers').controller('AlertDetailController', AlertDetailController);

AlertConfigController.$inject = [ '$scope', '$rootScope', '$stateParams', '$cordovaEmailComposer', '$filter',
	'$ionicLoading', 'Alerts' ];

function AlertDetailController($scope, $rootScope, $stateParams, $cordovaEmailComposer, $filter, $ionicLoading, Alerts) {
	$ionicLoading.show({
		content : 'Scouting',
		animation : 'fade-in',
		showBackdrop : true,
		maxWidth : 500,
		showDelay : 0
	});

	var emailBody = "";

	var emailTemplate = "<br><br> <b>Notification Details:</b><br> <span style=\"padding: 0 50px\"> @@1 </span> <br><br> <b>Affected Party Details:</b><br> <span style=\"padding: 0 50px\"> @@2 </span> <br><br> <b>Comments:</b> <span style=\"padding: 0 50px\"><br> @@3 </span><br><br><b>Shared By:</b> @@4 <b>On:</b> @@5";

	var email = {
		to : 'nuwan.thusitha@gtnexus.com',
		cc : 'nuwan.thusitha@gtnexus.com',
		bcc : [ 'john@doe.com', 'jane@doe.com' ],
		/*
		 * attachments: [ 'file://img/logo.png', 'res://icon.png',
		 * 'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...', 'file://README.pdf' ],
		 */
		subject : 'Scout Weather Alert Notification',
		body : emailBody,
		isHtml : true
	};

	var title = "";
	var tempAlert = $rootScope.alerts;
	for (var i = 0; i < tempAlert.length; i++) {
		if (tempAlert[i].id == $stateParams.alertId) {
			var currentAlert = tempAlert[i];
			title = currentAlert.name;

			$scope.affectedParty = "";

			try {
				Alerts.getAffectedParty(currentAlert.pSubcriberId, currentAlert.pSubscriptionId).then(
					function(data) {

						var partyDetailArray = [];
						if (data.name) {
							partyDetailArray.push(data.name);
						}

						if (data.address.addressLine1) {
							partyDetailArray.push(data.address.addressLine1);
						}

						if (data.address.addressLine2) {
							partyDetailArray.push(data.address.addressLine2);
						}

						if (data.address.city) {
							partyDetailArray.push(data.address.city);
						}

						if (data.address.countryCode) {
							partyDetailArray.push(data.address.countryCode);
						}

						/*
						 * currentAlert.affectedParty = data.name + ", " + data.address.addressLine1 + ", " +
						 * data.address.addressLine2 + ", " + data.address.city + ", " + data.address.countryCode;
						 */
						currentAlert.affectedParty = partyDetailArray.toString().replace(/,/g, ", ");
						$scope.alert = currentAlert;
						var formattedReceivedTime = $filter('date')($scope.alert.receivedTime, "MM-dd-yyyy h:mma");
						$scope.alert.receivedTime = formattedReceivedTime;
						
						/*
						emailBody += "<br><br>" + "<b>Notification Detail: </b><br>" + currentAlert.name + "-" + currentAlert.lastText
							+ "<br><br>" + "<b>Affected Party Details:</b>" + "<br>";
						emailBody += currentAlert.affectedParty;
						emailBody += "<br><br>" + "<b>Comments:</b><br>";
						*/
					var userObject = JSON.parse(localStorage.getItem(weather_config.local_storage_platform_susbscirber_json_key));
						
						
						emailBody = emailTemplate.replace("@@1", currentAlert.name + "-" + currentAlert.lastText).replace("@@2",
							currentAlert.affectedParty).replace("@@3", "<Enter message to recipient>").replace("@@4", userObject.username).replace("@@5", formattedReceivedTime);
						//TODO: Add user details and time stamp
						email.body = emailBody;

						$ionicLoading.hide();

					}, function(error) {
						if (weather_config.debug) {

							console.log(error);
						}
						$ionicLoading.hide();
					});
			} catch (err) {
				if (weather_config.debug) {

					console.log(err);
				}
				$ionicLoading.hide();
			}
		}
	}

	// $scope.alert = Alerts.get($stateParams.alertId);
	console.log("getting the scope alert");
	console.log($rootScope.alerts);

	// TODO: Alert background
	// $scope.alert = Alerts.get($stateParams.alertId);

	$cordovaEmailComposer.isAvailable().then(function() {
		// is available
		if (weather_config.debug) {

			console.log("cordova email componser is available");
		}

	}, function() {
		// not available

		if (weather_config.debug) {

			console.log("cordova email componser is un-available");
		}
	});

	// TODO: Generate email.

	$scope.sendEmail = function() {
		$cordovaEmailComposer.open(email).then(null, function() {
			// user cancelled email

			// do nothing for now.
		});
	};

}