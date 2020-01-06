<?php $root = realpath($_SERVER["DOCUMENT_ROOT"]) ?>

<!-- Header section -->
<?php
	require_once "$root/queue/queue_header.php";
?>

<!-- Default Section -->
<div class="dcf-wrapper dcf-txt-center dcf-p-10" ng-if="appointments == null">
	Select a site and date.
</div>

<!-- Body Section with list of clients -->
<table class="dcf-table queue dcf-mb-6 dcf-ml-2 dcf-mr-2" ng-if="appointments.length > 0" ng-cloak>
	<thead>
		<tr>
			<th class="queue-name">Name</th>
			<th class="queue-progress">Progress</th>
			<th class="queue-time">Scheduled Time</th>
		</tr>
	</thead>
	<tbody>
		<tr ng-repeat="appointment in appointments | orderBy:['noShow', 'timeIn == null', 'timeReturnedPapers == null', 'timeAppointmentStarted == null', 'scheduledTime', 'walkIn']" 
			ng-if="appointment.completed == null">
			<th class="queue-name" data-header="Name">{{appointment.firstName}} {{appointment.lastName}}</th>
			<td class="queue-progress" data-header="Progress">
				<span class="pill pill-no-show" ng-if="appointment.noShow">No-show</span>
				<span ng-if="!appointment.noShow">
					<span class="pill pill-walk-in" ng-if="appointment.walkIn">Walk-In</span>
					<span class="pill" ng-class="appointment.checkedIn ? 'pill-complete': 'pill-incomplete'">Checked In</span>
					<span class="pill" ng-class="appointment.paperworkComplete ? 'pill-complete': 'pill-incomplete'">Completed Paperwork</span>
					<span class="pill" ng-class="appointment.preparing ? 'pill-complete': 'pill-incomplete'">Appointment in Progress</span>
					<span class="pill" ng-class="appointment.ended ? 'pill-complete': 'pill-incomplete'">Appointment Complete</span>
				</span>
			</td>
			<td class="queue-time" data-header="Scheduled Time">{{appointment.scheduledTime}}</td>
		</tr>
	</tbody>
</table>

<!-- Default message if there are no appointments on the selected date -->
<div class="dcf-wrapper dcf-txt-center dcf-p-10 queue" ng-if="appointments.length == 0" ng-cloak>
	There are no appointments on this day.
</div>
