/**
 * @ngdoc function
 * @name starter.controllers.AlertConfigController
 * @description Alert configuration controller
 * @since 0.0.1
 */
angular.module('starter.controllers').controller('AlertConfigController', ['$scope', '$rootScope', '$stateParams', '$http', '$q', '$state', '$ionicLoading', '$ionicPopup', '$filter', 'PartyService', 'SubscriptionService',
    function($scope, $rootScope, $stateParams, $http, $q, $state, $ionicLoading, $ionicPopup, $filter, PartyService, SubscriptionService) {


        $ionicLoading.show({
            content: 'Scouting',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 400,
            showDelay: 0
        });

        // TODO : call service and populate scope

        $scope.filterParty = function(party) {
            // for testing chocking this condition
            var flag = true;
            if (party.partyRoleCode == 'Seller') {
                return true;
            }
            return flag;
        }

        /*Filter unique orgs in the party list*/
        var unique = function(origArr) {
            var newArr = [],
                origLen = origArr.length,
                found, x, y;

            for (x = 0; x < origLen; x++) {
                found = undefined;
                for (y = 0; y < newArr.length; y++) {
                    if (origArr[x].memberId === newArr[y].memberId) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    newArr.push(origArr[x]);
                }
            }
            return newArr;
        }


        // load from cache if possible
        if (!$rootScope.partyList) {
            PartyService
                .getPartyList($http)
                .then(
                    function(res) {
                        if (res.status == "ok" || res.status == "error") {
                            $scope.checkedParties = {};
                            $ionicLoading.hide();
                        }
                        if (res.partyList) {
                            // consumed by checkboxes.
                            var enhancedPartyList = interceptObjectArray(
                                res.partyList, 'enabled', false);
                            // set part list to scope to be
                            // consumed by the UI.

                            // validation to block adding
                            // subscriptions already
                            // added.
                            $scope.userObject = JSON
                                .parse(localStorage
                                    .getItem(weather_config.local_storage_platform_susbscirber_json_key));
                            console.log("subscriptions");
                            console
                                .log($scope.userObject.platformSubscriptions);

                            console.log("checking root scope party list");

                            for (var i = 0; i < enhancedPartyList.length; i++) {
                                enhancedPartyList[i].chkList = false;
                                enhancedPartyList[i].enabled = false;
                                if ($scope.userObject.platformSubscriptions && $scope.userObject.platformSubscriptions.length > 0) {
                                    for (var k = 0; k < $scope.userObject.platformSubscriptions.length; k++) {
                                        if (enhancedPartyList[i].memberId == $scope.userObject.platformSubscriptions[k].watchedFactory.memberId) {
                                            enhancedPartyList[i].chkList = true;
                                        }
                                    }
                                }

                            }
                            
                            var uniqueParties = unique(enhancedPartyList);
                            $rootScope.partyList = uniqueParties;
                            //used for filtering
                            $rootScope.fullPartyList = uniqueParties;
                            console.log("Loading party list");
                            console.log($rootScope.partyList);

                        }
                    });
        } else {

            enhancedPartyList = $rootScope.partyList;
            $scope.userObject = JSON
                .parse(localStorage
                    .getItem(weather_config.local_storage_platform_susbscirber_json_key));
            for (var i = 0; i < enhancedPartyList.length; i++) {
                enhancedPartyList[i].chkList = false;
                enhancedPartyList[i].enabled = false;
                if ($scope.userObject.platformSubscriptions && $scope.userObject.platformSubscriptions.length > 0) {
                    for (var k = 0; k < $scope.userObject.platformSubscriptions.length; k++) {
                        if (enhancedPartyList[i].memberId == $scope.userObject.platformSubscriptions[k].watchedFactory.memberId) {
                            enhancedPartyList[i].chkList = true;

                        }
                    }
                }

            }
            
            var uniqueParties = unique(enhancedPartyList)
            $rootScope.partyList = uniqueParties;
            //used for filtering
            $rootScope.fullPartyList = uniqueParties;
            console.log("Loading party list");
            console.log($rootScope.partyList);

            $ionicLoading.hide();
        }






        $scope.filterFactories = function($event) {
            var checkbox = $event.target;

            if (checkbox.checked) {
                if ($rootScope.partyList) {

                    var factories = $filter('filter')($rootScope.partyList, function(party) {

                        return (party.partyRoleCode == "Received From" ? true : false);

                    });
                    $rootScope.partyList = factories;
                }
            } else {
                $rootScope.partyList = $rootScope.fullPartyList;
            }
        }

        $scope.subscribeValidation = function(party) {
            if (party.chkList) {
                // display a alert Message
                /*
                 * var alertPopup = $ionicPopup.alert({ title : 'Already exixts.',
                 * template : 'Subscription is already added.you can\'t again' });
                 */

                // NO NEED FOR AN ANNOYING ALERT
                party.enabled = false;
            }
        };

        $scope.subscribeForAlert = function(frequency) {
            $ionicLoading.show({
                content: 'Scouting',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 500,
                showDelay: 0
            });
            // createSubscription($http,);

            // create a temp array to store picked objects
            var tempPlatformSubcriptions = new Array();

            var partyListObj = $rootScope.partyList;
            console.log(partyListObj.length);
            console.log(partyListObj[0]);
            var SubscriptionCount = 0;
            for (var i = 0; i < partyListObj.length; i++) {

                if (partyListObj[i].enabled) {
                    // pushing the selected item to the temp Array
                    SubscriptionCount++;
                    var timeStamp = Date.now();
                    var cSubObj = new CSubscription(timeStamp.toString(),
                        partyListObj[i]);
                    tempPlatformSubcriptions.push(cSubObj);
                }
            }
            if (tempPlatformSubcriptions.length == 0) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Error !',
                    template: 'There are no subsctions selected'
                });
                alertPopup.then(function(res) {

                });
            } else if ($scope.serverity == "") {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Error !',
                    template: 'Please choose the severity level.'
                });
                alertPopup.then(function(res) {

                });

            } else if (frequency != 60) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Error !',
                    template: 'Please choose Alert frequency.'
                });
                alertPopup.then(function(res) {

                });
            } else {


                // TODO: Inject subscribe for alter logic here.

                // display loading icon.


                var authToken = localStorage
                    .getItem(weather_config.local_storage_auth_token_key);
                // get platform subsScriberObj from local storage
                var CoObject = JSON
                    .parse(localStorage
                        .getItem(weather_config.local_storage_platform_susbscirber_json_key));
                console.log(CoObject);
                console.log(CoObject.fingerprint);

                // create subscription
                SubscriptionService.createSubsription($q, $http, CoObject,
                    tempPlatformSubcriptions, authToken, $scope.serverity).then(
                    function(res) {
                        // hide the loading spinner.
                        $ionicLoading.hide();
                        // result for create subscribers

                        // get UId's
                        // var newPlatformSubObject =
                        // res.subscriptions["data"];
                        console.log(res);
                        $state.go('tab.dash');

                    });


            }
        };

        $scope.severities = [{
            "id": 1,
            "label": "CAT 1 - Alert",
            "enabled": false,
            "value": "LEVEL_10"
        }, {
            "id": 2,
            "label": "CAT 2 - Warning",
            "enabled": false,
            "value": "LEVEL_20"
        }, {
            "id": 3,
            "label": "CAT 3 - Serious",
            "enabled": false,
            "value": "LEVEL_30"
        }, {
            "id": 4,
            "label": "CAT 4 - Critical",
            "enabled": false,
            "value": "LEVEL_40"
        }, {
            "id": 5,
            "label": "CAT 5 - Catastrophic",
            "enabled": false,
            "value": "LEVEL_50"
        }];

        $scope.serverity = "";
        $scope.serverityValidation = function(id) {

            var count = $scope.severities;
            for (var i = 0; i < count.length; i++) {
                if (($scope.severities[i].id == id) && ($scope.severities[i].enabled)) {
                    $scope.serverity = $scope.severities[i].value;
                } else {
                    $scope.severities[i].enabled = false;
                }
            }
        };

    }
]);
