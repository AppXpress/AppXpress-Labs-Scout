/**
 * @ngdoc function
 * @name starter.controllers.LoginController
 * @description Dash controller
 * @author nthusitha
 * @requires [$scope, $http, $state, $ionicLoading, $ionicPopup, $rootScope, $window, loginService, platformSubscriberService,
		Alerts, $injector]
 * @since 0.0.1
 */
angular.module('starter.controllers').controller('LoginController', ['$scope', '$http', '$state', '$ionicLoading', '$ionicPopup', '$rootScope', '$window', '$q', 'loginService', 'platformSubscriberService', 'Alerts', '$injector', function($scope, $http, $state, $ionicLoading, $ionicPopup, $rootScope, $window, $q, loginService, platformSubscriberService, Alerts, $injector) {

    // get username password from config

    var notificationService_ = null;
    $scope.userName = localStorage.getItem("username");
    $scope.password = localStorage.getItem("password");
    $scope.loginError = false;

    // signIn Function
    $scope.signIn = function(username, password) {
        console.log(username);
        $scope.loginError = false;
        if (username == "" || password == "") {
            $scope.loginError = true;
            $scope.errorMessage = "Username / Password cannot be empty.";
            weather_config.gtnx_user = "";
            weather_config.gtnx_pw = "";

            localStorage.setItem("username", weather_config.gtnx_user);
            localStorage.setItem("password", weather_config.gtnx_pw);
        } else {

            $ionicLoading.show({
                content: 'Loading!',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 400,
                showDelay: 0
            });
            $scope.userName = username;
            $scope.password = password;
            $scope.loginError = false;
            console.log("START CALLED");

            weather_config.gtnx_user = $scope.userName;
            weather_config.gtnx_pw = $scope.password;

            localStorage.setItem("username", weather_config.gtnx_user);
            localStorage.setItem("password", weather_config.gtnx_pw);

            // localStorage.getItem("username")
            // Code for Select the production Environment

            console.log(localStorage.getItem("username"));
            // TODO : Your login logic here

            console.log($scope.userName);
            console.log($scope.password);

            var loginServiceCall = loginService.login({
                userName: $scope.userName,
                password: $scope.password,
                eid: null
            });

            loginServiceCall.success(function(data, status, headers, config) {
                var header = headers();
                var authResponse = header.authorization;
                if (authResponse != null) {
                    console.log("AuthToken (in Response): " + authResponse);
                    var authToken = encodeHeader($scope.userName, $scope.password, null);
                    weather_config.authToken = authToken;
                    // weather_config.authToken = authResponse;// overwrite
                    // existing
                    // token
                    // localStorage.setItem("authToken", authResponse);
                    localStorage.setItem(weather_config.local_storage_auth_token_key, authToken);
                    // code for fetch the users information
                    $scope.getUserIdByName($scope.userName);

                    $state.go('tab.alerts');
                    $ionicLoading.hide();

                }

            }).error(function(data, status, headers, config) {
                console.log(data);
                console.log(status);
                console.log(headers());
                if (status == 401) {
                    $scope.loginError = true;
                    $scope.errorMessage = "Incorrect username and/or password";
                }

                $ionicLoading.hide();
            });


        }
    };

    // function to get userId by name
    $scope.getUserIdByName = function(userName) {
        var authToken = localStorage.getItem(weather_config.local_storage_auth_token_key);
        var platformSubscriberServiceCall = platformSubscriberService.findUser(userName, authToken);
        platformSubscriberServiceCall.success(function(data, status, headers, config) {

            console.log(data);
            console.log(status);
            // console.log(headers());

            var resultObj = data.resultInfo;
            if (data.result) {
                console.log(data.result[0]);
            }

            if (resultObj.count == 0) {

                $scope.createNewPlatformSubscriber(userName);
            } else {
                // storing the platform subscriber object into local
                // storage
                var jsonString = JSON.stringify(data.result[0]);
                console.log(data.result[0]["uid"]);
                localStorage.setItem(weather_config.local_storage_platform_susbscirber_json_key, jsonString);
                localStorage.setItem(weather_config.local_storage_platform_subscriber_id_key, data.result[0]["uid"]);
                syncWithPush();
            }

        }).error(function(data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers());
            if (status == 401) {

                $scope.errorMessage = "Incorrect username and/or password";
            }

        });

    };

    // function to create a new user object if there no user obj found
    // in platform
    // subscriber
    // module.
    $scope.createNewPlatformSubscriber = function(userName) {

        // time stamp for the UIdentifier.
        var timeStamp = Date.now();

        var platformSubscriberObj = new Object();
        platformSubscriberObj.type = weather_config.platform_subscription_design;
        platformSubscriberObj.uIdentifier = timeStamp.toString();
        platformSubscriberObj.username = userName.toLowerCase();
        platformSubscriberObj.status = "active";

        // create a owner object ,Currently its hard coded .This should
        // be ORG object of the
        // logged user.
        $scope.getOwnerByUserName(userName).then(function(response) {
            if (response != 'error') {


                var ownerObj = response;
                platformSubscriberObj.owner = ownerObj;
                // End of owner object code.
                var authToken = localStorage.getItem(weather_config.local_storage_auth_token_key);
                var platformSubscriberServiceCall = platformSubscriberService.createUser(platformSubscriberObj, authToken);
                platformSubscriberServiceCall.success(function(data, status, headers, config) {

                    console.log(data);
                    console.log(status);
                    console.log(headers()); // common method to get all success

                    var resultObj = data.create.result;
                    if (resultObj) {
                        console.log(resultObj);
                        // storing the platform subscriber object into local
                        // storage
                        var jsonString = JSON.stringify(resultObj);
                       // console.log(data.result[0]["uid"]);
                        localStorage.setItem(weather_config.local_storage_platform_susbscirber_json_key, jsonString);
                        localStorage.setItem(weather_config.local_storage_platform_subscriber_id_key, resultObj.uid);
                        syncWithPush();
                    }

                }).error(function(data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                    console.log(headers());
                    if (status == 401) {

                    }
                    // It's a common method to handle all responses.

                });

            }


        });


    };

    /*
     * platformSubscriberId and authToken must be persisted before call this.
     * 
     */
    var syncWithPush = function() {
        //TODO: ADD CONFIRMATION DIALOG FOR PUSH NOTIFICATIONS
        // UTC
        var date = new Date();
        var now = date.getTime();

        if (notificationService_ == null) {
            notificationService_ = $injector.get('NotificationService');
        }

        var lastSyncedTime = localStorage.getItem(weather_config.local_storage_last_device_token_sync_time_key);
        var cachedPlatformSubscriberId = localStorage.getItem(weather_config.local_storage_platform_subscriber_id_key);
        var cachedAuthToken = localStorage.getItem(weather_config.local_storage_auth_token_key);

        if (lastSyncedTime && lastSyncedTime != '') {
            if ((now - lastSyncedTime) >= weather_config.apns_device_token_refresh_interval_ms) {
                // if time stamp is not updated previously
                // do if token expires after given time
                notificationService_.registerForPushNotifications($http, Alerts, cachedPlatformSubscriberId, cachedAuthToken);
                localStorage.setItem(weather_config.local_storage_last_device_token_sync_time_key, now);
                if (weather_config.debug) {
                    console.log("synced apns/gcm device token, token expiry time reached");
                }
            }
        } else {

            if (weather_config.debug) {
                console.log("synced apns/gcm device token for the first time");
            }
            // do for the first time.
            notificationService_.registerForPushNotifications($http, Alerts, cachedPlatformSubscriberId, cachedAuthToken);
            localStorage.setItem(weather_config.local_storage_last_device_token_sync_time_key, now);
        }
    }

    // function to get owner object by username
    $scope.getOwnerByUserNameDeprecated = function(userName) {
        // create a owner object ,Currently its hard coded .This should
        // be ORG object of the
        // logged user.
        var ownerObj = new Object();
        ownerObj.partyRoleCode = "Buyer";

        var addressObj = new Object();
        addressObj.countryCode = "US";
        addressObj.stateOrProvince = "New York";
        addressObj.addressLine2 = "31st Floor";
        addressObj.postalCodeNumber = "NY 10041";
        addressObj.addressLine1 = "55 Water Street";
        addressObj.city = "New York";

        ownerObj.address = addressObj;
        ownerObj.name = "Scout Buyer";
        ownerObj.memberId = "3717989018024131";
        ownerObj.contact = new Object();

        return ownerObj;
        // End of owner object code.
    };

    // function to get owner object by username
    $scope.getOwnerByUserName = function(userName) {

        var authToken = localStorage.getItem(weather_config.local_storage_auth_token_key);
        var defer = $q.defer();

        if (authToken) {
            loginService.getUserDetails(authToken).success(function(data, status, headers, config) {

                if (data.organizationUid) {
                    var ownerParty = new Object();
                    ownerParty.memberId = data.organizationUid;
                    defer.resolve(ownerParty);

                } else {
                    defer.reject('error');
                }

            }).error(function(data, status, headers, config) {
                defer.reject('error');

            });
        } else {

            if (weather_config.debug) {
                console.log("error occured while getting owner org, cause: can't find authtoken the local storage");
            }
        }

        return defer.promise;
    }


    // function for logout
    $scope.logout = function() {

        // to pop up the logout confirmation
        var confirmPopup = $ionicPopup.confirm({
            title: 'Logout',
            template: 'Are you sure you want to logout ?'
        });
        confirmPopup.then(function(res) {
            if (res) {

                localStorage.removeItem(weather_config.local_storage_auth_token_key);
                localStorage.removeItem(weather_config.local_storage_platform_susbscirber_json_key);
                localStorage.removeItem(weather_config.local_storage_platform_subscriber_id_key);

                // localStorage.removeItem("username");
                weather_config.authToken = null;
                // reset login fields

            } else {
                // nothing to do
            }
        });

    };

}]);
