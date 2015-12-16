/**
 * @ngdoc function
 * @name starter.controllers.AlertsController
 * @description Alert controller
 * @requires [$scope, Alerts, $ionicScrollDelegate, $http,
  $ionicLoading, $state, NotificationService, SubscriptionService, $q,
  $timeout, uiGmapIsReady, $rootScope, PartyService]
 * @since 0.0.1
 */

angular.module('starter.controllers').controller('AlertsController',
    AlertsController);

AlertsController.$inject = ['$scope', 'Alerts', '$ionicScrollDelegate',
    '$http', '$ionicLoading', '$state', 'NotificationService',
    'SubscriptionService', '$q', '$timeout', 'uiGmapIsReady', '$rootScope',
    'PartyService', '$filter'
];

function AlertsController($scope, Alerts, $ionicScrollDelegate, $http,
    $ionicLoading, $state, NotificationService, SubscriptionService, $q,
    $timeout, uiGmapIsReady, $rootScope, PartyService, $filter) {

    $scope.showMapWindow = function() {
        $state.go('tab.maps');
    }

    $scope.popInfoWindow = function(key, val, data) {

        console.log(key);
        console.log(data);
        var infoWindow = new google.maps.InfoWindow({
            map: $scope.map,
            position: new google.maps.LatLng(data.lat, data.lon),
            title: data.name,
            content: data.name,
            id: 'info_' + val,
            visibleOnMarker: val

        });

        $scope.map.markers[val].infoWindows = infoWindow;

    };

    $scope.showMarkers = function() {

        $scope.infoWindowTrigger = false;
        console.log($scope.map.markers);
        console.log($scope.map);

        // close all current windows
        for (var key in $scope.map.markers) {

            if ($scope.map.markers[key].hasOwnProperty('infoWindows')) {
                $scope.map.markers[key].infoWindows.setMap(null);
            }

        }

        for (var key in $scope.map.markers) {
            // $scope.map.markers[key].setMap(null);

            var infoWindow = new google.maps.InfoWindow({
                map: $scope.map,
                position: new google.maps.LatLng(
                    $scope.map.markers[key].position.G,
                    $scope.map.markers[key].position.K),
                title: $scope.map.markers[key].title,
                content: $scope.map.markers[key].title,
                id: 'info_' + key,
                visibleOnMarker: key
            });

            $scope.map.markers[key].infoWindows = infoWindow;

        }

        console.log($scope.map.markers);
        console.log($scope.map);

    };

    $scope.hideInfoWindows = function() {
        $scope.infoWindowTrigger = true;
        for (var key in $scope.map.markers) {

            if ($scope.map.markers[key].hasOwnProperty('infoWindows')) {
                $scope.map.markers[key].infoWindows.setMap(null);
            }

        }
    };
    $scope.loadInfoWindows = function() {
        for (var key in $scope.map.markers) {
            // $scope.map.markers[key].setMap(null);
            console.log(key + 'keys:');
            var infoWindow = new google.maps.InfoWindow({
                map: $scope.map,
                position: new google.maps.LatLng(
                    $scope.map.markers[key].position.G,
                    $scope.map.markers[key].position.K),
                title: $scope.map.markers[key].title,
                content: $scope.map.markers[key].title,
                id: 'info_' + key,
                visibleOnMarker: key

            });

            $scope.map.markers[key].infoWindows = infoWindow;
        }
    }

    $scope.image = {
        url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        size: [20, 32],
        origin: [0, 0],
        anchor: [0, 32]
    };
    $scope.shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };

    $scope.filterTypes = [{
        "id": 1,
        "label": "Seller",
        "enabled": false,
        "value": "Seller"
    }, {
        "id": 2,
        "label": "Buyer",
        "enabled": false,
        "value": "Buyer"
    }, {
        "id": 3,
        "label": "Factory",
        "enabled": false,
        "value": "Factory"
    }, {
        "id": 4,
        "label": "All",
        "enabled": false,
        "value": "All"
    }];

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
         * console.log($scope.map); var total= new Object();
         * total=$scope.map.markers;
         *
         * if( $scope.map.markers.hasOwnProperty('0')){ console.log("im in
         * undefind"); }else{ console.log("im in not undefind");
         *
         * //$timeout(function(){$scope.loadInfoWindows();} ,500); }
         */
    }

    $scope.settings = {
        enableAlerts: true
    };

    $scope.hideAlerts = function() {

        if ($scope.on == true) {
            $scope.showMap = false;
            $scope.showAlertConf = false;
            $scope.alertList = false;

        } else {
            // $ionicScrollDelegate.scrollTop(false);
            $scope.showMap = true;
            $scope.showAlertConf = false;
            $scope.alertOn = !$scope.alertOn;
            // $ionicScrollDelegate.scrollBy(900, 0, true);
        }
    }

    $scope.alertConfig = function() {
        if ($scope.alertOn == true) {
            $scope.showAlertConf = false;
            $scope.alertList = false;
            $scope.showMap = false;

        } else {
            $scope.showAlertConf = true;
            $scope.alertList = true;
            $scope.showMap = false;
            $scope.on = !$scope.on;
        }
    }
    var alertsAlready = new Array();

    $scope.doRefresh = function() {
        var userObject = JSON
            .parse(localStorage
                .getItem(weather_config.local_storage_platform_susbscirber_json_key));

        if(userObject){

        var platformSubscriberId = userObject.uid;
        // deduct 1 hour
        var d = new Date();
        var d2 = new Date();
        d.setHours(d2.getHours() - 1);
        console.log(d);
        console.log(d2);
        date1 = new Date();
        // year, month, day [, hrs] [, min] [, sec]

        var beginTimeUtc = convertToUTC(d);
        var endTimeUtc = convertToUTC(d2);
        console.log(beginTimeUtc);
        console.log(endTimeUtc);
        var AlertsArray = new Array();
        // AlertsArray=$scope.alerts;
        // var alertsAlready=$scope.alerts;
        for (var i = 0; i < alertsAlready.length; i++) {
            AlertsArray.push(alertsAlready[i]);
        }

        Alerts
            .all($http, platformSubscriberId, beginTimeUtc, endTimeUtc)
            .then(
                function(res) {
                    if (res.status == 200) {
                        console.log(res);
                        var alertsArrayResult = res.data.alerts;

                        //defaul to yahoo.
                        var dataProvider = "yahoo";
                        Alerts.fetchServiceProviderForIcons($http).then(function(res) {
                            dataProvider = res.data.provider;
                            if (weather_config.debug) {
                                console.log("weather provider is " + dataProvider);

                            }
                            for (var i = 0; i < alertsArrayResult.length; i++) {


                               // var localeTime = moment().utc(alertsArrayResult[i].receivedTime).local();
                               var localTime = new Date(alertsArrayResult[i].receivedTime);
                                /*
                                var tempUtcLong = new Date(
                                    alertsArrayResult[i].receivedTime);

                                var fullYear = tempUtcLong.getFullYear();
                                var month = 0;
                                var date = 0;
                                var hours = 0;
                                var mins = 0;
                                var secs = 0;
                                if (tempUtcLong.getMonth() < 10) {
                                    month = tempUtcLong.getMonth() + 1;
                                    if (month < 10) {
                                        month = "0" + month;
                                    }

                                } else {
                                    month = tempUtcLong.getMonth() + 1;
                                }

                                if (tempUtcLong.getDate() < 10) {
                                    date = "0" + tempUtcLong.getDate();
                                } else {
                                    date = tempUtcLong.getDate();
                                }

                                if (tempUtcLong.getHours() < 10) {
                                    hours = "0" + tempUtcLong.getHours();
                                } else {
                                    hours = tempUtcLong.getHours();
                                }

                                if (tempUtcLong.getMinutes() < 10) {
                                    mins = "0" + tempUtcLong.getMinutes();
                                } else {
                                    mins = tempUtcLong.getMinutes();
                                }

                                if (tempUtcLong.getSeconds() < 10) {
                                    secs = "0" + tempUtcLong.getSeconds();
                                } else {
                                    secs = tempUtcLong.getSeconds();
                                }

                                var utcString = fullYear + "-" + month + "-" + date + " " + hours + ":" + mins + ":" + secs;
                                var utc = moment.tz(utcString, "UTC");
                                var tz = jstz.determine(); // Determines
                                // the time zone
                                // of the
                                // browser
                                // client
                                var tzName = tz.name(); // Returns the name
                                // of the time
                                // zone eg "Europe/Berlin"
                                // convert from UTC to local time
                                var localDateTime = utc.clone().tz(tzName);

                                moment.locale('en');
                                // after a long fight for 10 hours I managed
                                // to crunch UTC to time zone conversion.
                                // damn you js Date!!
                                   var receivedTime_ = localDateTime.format();
                                */
                                //var receivedTime_ = localeTime.format("llll");
                                // var receivedTime_ = localTime.toString();
                                var receivedTime_ = $filter('date')(localTime, 'medium');
                               
                                // time conversion hazzle. Show it as UTC
                                // with time zone instead

                                //synergy mode
                                var iconsArray = weather["icons"];
                                var imageFile = "";
                                for (var j = 0; j < iconsArray.length; j++) {
                                    if (dataProvider == 'yahoo') {
                                        var dirtyTitleString = angular.lowercase(alertsArrayResult[i].detail);
                                        if (dirtyTitleString.trim() == iconsArray[j].code) {
                                            imageFile = "img/" + iconsArray[j].icon;
                                            if (weather_config.debug) {
                                                console.log("weather icon is " + iconsArray[j].icon);
                                            }
                                            break;
                                        }
                                    } else {
                                        var dirtyTitleString = angular.lowercase(alertsArrayResult[i].title);
                                        if (dirtyTitleString.trim() == iconsArray[j].code) {
                                            imageFile = "img/" + iconsArray[j].icon;
                                            if (weather_config.debug) {
                                                console.log("weather icon is " + iconsArray[j].icon);
                                            }
                                            break;
                                        }
                                    }

                                }



                                var obj = {
                                    id: alertsArrayResult[i].uid,
                                    name: alertsArrayResult[i].title,
                                    lastText: alertsArrayResult[i].detail,
                                    subTitle: '',
                                    face: imageFile,
                                    background: 'background eq',
                                    /*
                                    effectedSuppliers: [{
                                      name: 'Kapare India Ltd',
                                      po: ['8749433', '5343433']
                                    }, {
                                      name: 'Yangmao Industries',
                                      po: ['366465']
                                    }],
                                    */
                                    pSubcriberId: alertsArrayResult[i].platformSubscriberId,
                                    pSubscriptionId: alertsArrayResult[i].platformSubscriptionId,
                                    receivedTime: receivedTime_
                                };

                                var bool = true;
                                for (var k = 0; k < Alerts.length; k++) {
                                    if (alertsArray[i].uid == alertsTempArrayCompare[k].id) {
                                        bool = false;
                                    }

                                }
                                if (bool) {
                                    AlertsArray.push(obj);
                                }

                            }
                            alertsAlready = AlertsArray;
                            $scope.alerts = $scope.insertionSort(
                                AlertsArray, "receivedTime");
                            console.log("sorted array");
                            console.log($scope.alerts);
                            $rootScope.alerts = $scope.alerts;
                        });




                    } else {
                        $scope.alerts = [];
                        $rootScope.alerts = $scope.alerts;
                    }
                });
        }else{

            if(weather_config.debug){
              console.log("unable to find the platform scuscriber in the localstorage");
            }
        }   


    }
    $scope.doRefresh();

    /*
    $scope.getIcon = function(title) {

      Alerts.fetchServiceProviderForIcons($http).then(function(res) {
        var iconsArray = weather[res.data.provider];
        for (var i = 0; i < iconsArray.length; i++) {
          if (angular.lowercase(title) == iconsArray[i].code) {
            return "img/" + iconsArray[i].code;
            if (weather_config.debug) {
              console.log("weather icon is " + iconsArray[i].icon);
            }
          }
        }
      });
    };
    */


    $scope.$watch('alerts', function() {

        $rootScope.alerts = $scope.alerts;
    });

    $scope.remove = function(alert) {
        Alerts.remove(alert);
    }

    $scope.insertionSort = function(files, attrToSortBy) {
        for (var k = 1; k < files.length; k++) {
            for (var i = k; i > 0 && new Date(files[i][attrToSortBy]) > new Date(
                    files[i - 1][attrToSortBy]); i--) {

                var tmpFile = files[i];
                files[i] = files[i - 1];
                files[i - 1] = tmpFile;

            }
        }
        return files;
    }

}
