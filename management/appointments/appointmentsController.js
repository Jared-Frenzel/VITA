define('appointmentsController', [], function() {

	function appointmentsController($scope, AppointmentsService, sharedPropertiesService) {

		$scope.sharedProperties = sharedPropertiesService.getSharedProperties();

		$scope.getAppointments = function() {
			let year = new Date().getFullYear();
			AppointmentsService.getAppointments(year).then(function(result) {
				if(result == null) {
					alert('There was an error loading the appointments. Please try refreshing the page.');
				} else {
					if (!result.success) {
						$scope.appointments = [];
						alert(result.error);
						return;
					}
	
					if (result.appointments.length > 0) {
						$scope.appointments = result.appointments.map((appointment) => {
							// We force the time into CST
							appointment.scheduledTime = new Date(appointment.scheduledTime + ' CST');
							appointment.name = appointment.firstName + " " + appointment.lastName;
							return appointment;
						});
					} else {
						$scope.appointments = [];
					}
				}
			});
		};

		$scope.rescheduleAppointment = function() {
			if ($scope.sharedProperties.selectedDate == null || $scope.sharedProperties.selectedSite == null || $scope.sharedProperties.selectedTime == null) {
				return false;
			}

			let appointmentId = $scope.appointment.appointmentId;
			let scheduledTime = new Date($scope.sharedProperties.selectedDate + ' ' + $scope.sharedProperties.selectedTime + ' GMT').toISOString();
			let siteId = $scope.sharedProperties.selectedSite;

			AppointmentsService.rescheduleAppointment(appointmentId, scheduledTime, siteId).then(function(result) {
				if (result.success) {
					// We force it to be in CST
					$scope.appointment.scheduledTime = new Date($scope.sharedProperties.selectedDate + ' ' + $scope.sharedProperties.selectedTime + ' CST');
					$scope.appointment.title = $scope.sharedProperties.selectedSiteTitle;

					// Clear the selected values
					$scope.sharedProperties.selectedDate = null;
					$scope.sharedProperties.selectedSite = null;
					$scope.sharedProperties.selectedTime = null;
					
					// Let the user know it was successful
					WDN.initializePlugin('notice');
					var body = angular.element( document.querySelector( 'body' ) );
					body.append(`
						<div class="wdn_notice affirm" data-overlay="maincontent" data-duration="10">
							<div class="close">
								<a href="#">Close this notice</a>
							</div>
							<div class="message">
								<p class="title">Success!</p>
								<p>This appointment was successfully rescheduled.</a>
								</p>
							</div>
						</div>`);  
				} else {
					alert(result.error);

					// Let the user know it failed
					WDN.initializePlugin('notice');
					var body = angular.element( document.querySelector( 'body' ) );
					body.append(`
						<div class="wdn_notice negate" data-overlay="maincontent" data-duration="10">
							<div class="close">
								<a href="#">Close this notice</a>
							</div>
							<div class="message">
								<p class="title">Failure</p>
								<p>Something went wrong and this appointment was not rescheduled!</a>
								</p>
							</div>
						</div>`);
				}
			});
		}

		$scope.selectAppointment = function(appointment) {
			$scope.appointment = appointment;
		};

		$scope.deselectAppointment = function() {
			$scope.appointment = null;
		}

		// Invoke initially
		$scope.getAppointments();

	}

	appointmentsController.$inject = ['$scope', 'appointmentsDataService', 'sharedPropertiesService'];

	return appointmentsController;

});
