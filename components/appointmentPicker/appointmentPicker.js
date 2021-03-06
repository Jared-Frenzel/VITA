require.config({
	paths: {
		angular: '//ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min',
		ngAnimate: '//ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-animate.min',
		ngAria: '//ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-aria.min',
		appointmentPickerSharedPropertiesService: '/dist/components/appointmentPicker/appointmentPickerSharedPropertiesService',
		appointmentPickerDataService: '/dist/components/appointmentPicker/appointmentPickerDataService',
		appointmentPickerController: '/dist/components/appointmentPicker/appointmentPickerController'
	},
	shim: {
		'ngAnimate': ['angular'],
		'ngAria': ['angular'],
		'appointmentPickerSharedPropertiesService': ['angular'],
		'appointmentPickerDataService': ['angular'],
		'appointmentPickerController': ['angular']
	}
});

require(['angular', 'ngAnimate', 'ngAria'], function(){

	require([
		'appointmentPickerSharedPropertiesService',
		'appointmentPickerDataService',
		'appointmentPickerController'
	],
	function (
		AppointmentPickerSharedPropertiesService,
		AppointmentPickerDataService,
		AppointmentPickerController
	) {
		'use strict';

		// Create the module
		var appointmentPickerApp = angular.module('appointmentPickerApp', []);

		appointmentPickerApp.service('appointmentPickerSharedPropertiesService', AppointmentPickerSharedPropertiesService)
		appointmentPickerApp.factory('appointmentPickerDataService', AppointmentPickerDataService);
		appointmentPickerApp.controller('appointmentPickerController', AppointmentPickerController);
		appointmentPickerApp.directive('appointmentPicker', function () {
			return {
				controller: 'appointmentPickerController',
				templateUrl: '/components/appointmentPicker/appointmentPicker.php'
			};
		});

		angular.bootstrap(document.getElementById('appointmentPickerApp'), ['appointmentPickerApp']);

	});
});
