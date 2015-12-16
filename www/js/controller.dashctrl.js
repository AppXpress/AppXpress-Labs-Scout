/**
 * @ngdoc function
 * @name starter.controllers.DashController
 * @description Dash controller
 * @author nthusitha
 * @requires [$scope, $http, $ionicActionSheet, $ionicLoading, SubscriptionService, platformSubscriberService,$state]
 * @since 0.0.1
 */

angular.module('starter.controllers').controller('DashController', DashController);

DashController.$inject = ['$scope', '$http', '$ionicActionSheet', '$ionicLoading', 'SubscriptionService', 'platformSubscriberService', '$state'];

function DashController($scope, $http, $ionicActionSheet, $ionicLoading, SubscriptionService, platformSubscriberService, $state) {



    $scope.show = function(platformSubscriberId, platformSubId) {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
           // buttons: [{
               // text: '<b>Duplicate</b> Alert'
            //}, ],

            destructiveText: 'Delete',
            destructiveButtonClicked: function() {
                //Do Stuff
                $scope.deleteSubscription(platformSubscriberId, platformSubId);

                return true;
            },
            titleText: 'Modify Subscription',
            cancelText: 'Cancel',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {


                return true;
            }
        });
    };

    $scope.loadView = function() {
        //$scope.userObject="";
        $ionicLoading.show({
            content: 'Loading!',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 400,
            showDelay: 0
        });
        $scope.loginError = false;
        // service call to fetch the Subscriber object
        var userName = localStorage.getItem("username");
        var authToken = localStorage.getItem(weather_config.local_storage_auth_token_key);
        platformSubscriberService
            .findUser(userName, authToken)
            .success(
                function(data, status, headers, config) {
                    $scope.loginError = false;

                    if (data.resultInfo.count > 0) {

                        // adiing bool values for each object.

                        // Todo: Initialize the states of toggle here
                        // adding subscriptions Uid's to get the toggle
                        // initial state.
                        var length = 0;
                        var totalSubs = new Object();
                        if (!data.result[0].hasOwnProperty('platformSubscriptions')) {
                            length = 0;
                            if (weather_config.debug) {
                                console.log("can't find platformSubscriptions in the oql response, attempting to get by uid");
                            }
                            //if there is no platformSubscriptions get subscriber by uid (quick hack)
                            platformSubscriberService.getSubscriberDetails(data.result[0].uid, authToken).success(function(data, status) {
                                if (weather_config.debug) {
                                    console.log("fetched platformSubscriptions by uid");
                                }
                                totalSubs = data.platformSubscriptions;

                            });


                        } else {
                            totalSubs = data.result[0].platformSubscriptions;
                            length =
                                totalSubs.length;
                        }

                        var arrayOfSubId = new Array();


                        for (var i = 0; i < length; i++) {

                            var arg = new Object();
                            arg.platformSubscriberId = data.result[0].uid;
                            arg.platformSubId = data.result[0].platformSubscriptions[i].uid;
                            arrayOfSubId[i] = arg;

                        }
                        // service call to get the initial stage

                        SubscriptionService
                            .checkSubscriptionState($http, arrayOfSubId)
                            .then(
                                function(res) {

                                    if (res.status == "OK" || res.status == "ok") {
                                        // igore the depth of data
                                        // node for now.

                                        console.log("test active states");
                                        console.log(res);
                                        var toggleStatesResponseArray = res.data.data.data;
                                        if (totalSubs.length == toggleStatesResponseArray.length) {
                                            for (var i = 0; i < length; i++) {
                                                // initialize all
                                                // false

                                                var platformSubscription = data.result[0].platformSubscriptions[i];

                                                platformSubscription.enabled = false;



                                                for (var j = 0; j < toggleStatesResponseArray.length; j++) {
                                                    // need to do a chk
                                                    // 
                                                    // 

                                                    if (platformSubscription.uid == toggleStatesResponseArray[j].platformSubId) {

                                                        if (toggleStatesResponseArray[j].active != 'undefined') {

                                                            if (toggleStatesResponseArray[j].active) {
                                                                platformSubscription.enabled = true;
                                                            }
                                                            if (weather_config.debug) {
                                                                console.log("subscriptions state check result");
                                                                console.log("subscriberId > " + data.result[0].uid + " subscriptionId > " + data.result[0].platformSubscriptions[i].uid + " status > " + data.result[0].platformSubscriptions[i].enabled);
                                                                console.log("end subscription state check result");
                                                            }

                                                        } else {

                                                            if (weather_config.debug) {
                                                                console
                                                                    .log("arguments passed to the servers are null, server returned response without active flag, defaulting the state to false");
                                                            }
                                                        }

                                                    }
                                                }
                                            }

                                            // set to local storage
                                            var jsonString = JSON.stringify(data.result[0]);
                                            localStorage.setItem(weather_config.local_storage_platform_susbscirber_json_key,
                                                jsonString);
                                            // getting user object
                                            // from cache
                                            $scope.userObject = JSON.parse(localStorage
                                                .getItem(weather_config.local_storage_platform_susbscirber_json_key));
                                            console.log("subscriptions");
                                            console.log($scope.userObject.platformSubscriptions);
                                            $ionicLoading.hide();
                                        } else {
                                            console.log("Currently no subscriptions . !!!");
                                            $scope.loginError = true;
                                            $scope.errorMessage = "Click on the + sign to subscribe to your first alert";
                                            $scope.userObject = "";
                                            // set to local storage
                                            var jsonString = JSON.stringify(data.result[0]);
                                            localStorage.setItem(weather_config.local_storage_platform_susbscirber_json_key,
                                                jsonString);
                                            $ionicLoading.hide();

                                        }

                                    } else {
                                        console.log("error");
                                        $scope.loginError = true;
                                        $scope.errorMessage = "Connection fail !!!";
                                        $ionicLoading.hide();
                                    }

                                });

                    } else {
                        console.log("error");
                        $scope.loginError = true;
                        $scope.errorMessage = "current subscription count is 0";
                        $ionicLoading.hide();
                    }

                }).error(function(data, status, headers, config) {
                /* if (status == 401) { */
                // print the error message here........
                $scope.loginError = true;
                $scope.errorMessage = "Connection fail !!!";
                $ionicLoading.hide();
                /* } */
            });
    };
    $scope.loadView();

    //  
    $scope.toggleSubscription = function(platformSubscriberId, platformSubId, activate) {

        $ionicLoading.show({
            content: 'Loading!',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 400,
            showDelay: 0
        });

        console.log(platformSubscriberId + " " + platformSubId + " " + activate);

        SubscriptionService.toogleSubscription($http, platformSubscriberId, platformSubId, activate).then(function(res) {
            $ionicLoading.hide();
        });
    };

    $scope.deleteSubscription = function(platformSubscriberId, platformSubId) {

        $ionicLoading.show({
            content: 'Loading!',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 400,
            showDelay: 0
        });
        var userName = localStorage.getItem("username");
        var authToken = localStorage.getItem(weather_config.local_storage_auth_token_key);
        //remove the subscription from the platform.
        platformSubscriberService
            .findUser(userName, authToken)
            .success(
                function(data, status, headers, config) {
                    if (data.resultInfo.count > 0 && data.result[0].hasOwnProperty('platformSubscriptions')) {
                        var totalSubs = data.result[0].platformSubscriptions;
                        var PlatformSubObject = new Object();
                        PlatformSubObject = data.result[0];
                        length = totalSubs.length;
                        var subsTempArray = new Array();
                        for (var i = 0; i < length; i++) {
                            if (data.result[0].platformSubscriptions[i].uid == platformSubId) {



                            } else {
                                subsTempArray.push(data.result[0].platformSubscriptions[i]);
                            }

                        }
                        data.result[0].platformSubscriptions = subsTempArray;
                        console.log("object removed");
                        console.log(data.result[0]);

                        //post the deleted json to platform
                        var authToken = localStorage.getItem(weather_config.local_storage_auth_token_key);

                        SubscriptionService.updatePlatformSubscriberObject($http, data.result[0], authToken).then(function(res) {
                            console.log(res);

                            if (res.status == "ok") {
                                SubscriptionService.removeSubscriptionMiddleServer($http, platformSubscriberId, platformSubId).then(function(res) {
                                    console.log(res);

                                    $scope.loadView();
                                    $ionicLoading.hide();
                                });
                            } else {
                                $scope.loadView();
                                $ionicLoading.hide();
                            }
                        });

                    }
                }).error(function(data, status, headers, config) {
                $scope.loadView();
                $ionicLoading.hide();
            });
    }

}
