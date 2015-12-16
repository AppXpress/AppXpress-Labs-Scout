/**
 * @ngdoc function
 * @name starter.controllers.AccountController
 * @description Unified global config for the app
 * @author nthusitha
 * @requires [$scope, $rootScope, NotificationService, $http, Alerts, ConfigService]
 * @since 0.0.1
 */
angular.module('starter.controllers').controller('AccountController', AccountController);

AccountController.$inject = ['$scope', '$rootScope', 'NotificationService', '$http', 'Alerts', 'ConfigService'];

function AccountController($scope, $rootScope, NotificationService, $http, Alerts, ConfigService) {

    /*
     * if (!$rootScope.apnsSettings) { $rootScope.apnsSettings = { enableAlerts :
     * 'OFF' }; }
     */
    var cachedPlatformSubscriberId = localStorage.getItem(weather_config.local_storage_platform_subscriber_id_key);

    if (cachedPlatformSubscriberId != 'undefined' && cachedPlatformSubscriberId.length > 0) {

        if (!$rootScope.apnsSettings) {
        	//initialise the enable alert to true.
            $rootScope.apnsSettings = {
                enableAlerts: 'ON'
            }
        }

    } else {
        $rootScope.apnsSettings = {
            enableAlerts: 'OFF'
        }
    }

    $scope.toogleAPNS = function() {

        var apnsFlag = $rootScope.apnsSettings.enableAlerts;
        var cachedPlatformSubscriberId = localStorage.getItem(weather_config.local_storage_platform_subscriber_id_key);
        var cachedAuthToken = localStorage.getItem(weather_config.local_storage_auth_token_key);

        switch (apnsFlag) {
            case 'ON':

                if (weather_config.debug) {
                    console.log("enabling apns");
                }

                // renew device Token with apns and sync middle server (both)
                NotificationService.registerForPushNotifications($http, Alerts, cachedPlatformSubscriberId, cachedAuthToken);
                // ConfigService.turnOffDoNotDisturb($http, new Object());
                // PushService.initPush($http, Alerts);
                break;

            case 'OFF':
                if (weather_config.debug) {
                    console.log("unregister apns");
                }
                // PushService.unregisterPush();
                // pull off the device token from apns
                var cachedPushdSubscriberId = localStorage.getItem(weather_config.local_storage_pushd_subscriber_id_key);
                var device = new MDevice(null, null, 'apns', cachedPlatformSubscriberId, cachedPushdSubscriberId, true);

                // defer teh do not disturb in un-register call fails.
                // trap outbound notifications from middle server.
                // Chain promises
                NotificationService.unregisterForPushNotification().then(ConfigService.turnOnDoNotDisturb($http, device));

                // trap outbound notifications from middle server.
                // ConfigService.turnOnDoNotDisturb($http, device);
                break;
            default:
                // nothing to do
                break;
        }

    };

}
