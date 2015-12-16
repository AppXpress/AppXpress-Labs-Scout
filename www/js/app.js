// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [ 'ionic', 'starter.controllers', 'starter.services', 'uiGmapgoogle-maps' ]).config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
    	china: true,
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory
		// bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleLightContent();
		}
		//wrapping window.open with inAppBrowser
	window.open = cordova.InAppBrowser.open;
		
	});
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
	$ionicConfigProvider.views.maxCache(0);
	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js

	
	$stateProvider.state('start', {
		url : '/start',
		views : {
			'' : {
				templateUrl : 'templates/login.html',
				controller : 'LoginController'
			}
		}
	})
	
	$stateProvider.state('disclaimer', {
		url : '/disclaimer',
		views : {
			'' : {
				templateUrl : 'templates/disclaimer.html'
			}
		}
	})

	// setup an abstract state for the tabs directive
	.state('tab', {
		url : "/tab",
		abstract : true,
		templateUrl : "templates/tabs.html"
	})

	// Each tab has its own nav history stack:

	.state('tab.dash', {
		url : '/dash',
		views : {
			'tab-dash' : {
				templateUrl : 'templates/tab-dash.html',
				controller : 'DashController'
			}
		}
	})
	.state('tab.maps', {
		url : '/maps',
		views : {
			'tab-alerts' : {
				templateUrl : 'templates/alert-map.html',
				controller : 'MapsController'
			}
		}
	})
	.state('tab.alerts', {
		url : '/alerts',
		views : {
			'tab-alerts' : {
				templateUrl : 'templates/tab-alerts.html',
				controller : 'AlertsController'
			}
		}
	}).state('tab.alert-detail', {
		url : '/alerts/:alertId',
		views : {
			'tab-alerts' : {
				templateUrl : 'templates/alert-detail.html',
				controller : 'AlertDetailController'
			}
		}
	}).state('tab.alert-po', {
		url : '/alertpo/:poNumber',
		views : {
			'tab-alerts' : {
				templateUrl : 'templates/alert-po.html',
				controller : 'AlertPOController'
			}
		}
	}).state('tab.alert-config', {
		url : '/config',
		views : {
			'tab-alerts' : {
				templateUrl : 'templates/alert-config.html',
				controller : 'AlertConfigController'
			}
		}
	})

	.state('tab.account', {
		url : '/account',
		views : {
			'tab-account' : {
				templateUrl : 'templates/tab-account.html',
				controller : 'AccountController'
			}
		}
	});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/start');
	// $httpProvider.interceptors.push('authInterceptor');

});
