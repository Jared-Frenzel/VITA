<?php

$root = realpath($_SERVER['DOCUMENT_ROOT']);
require_once "$root/server/user.class.php";
$USER = new User();
if (!$USER->isLoggedIn()) {
	header("Location: /unauthorized");
	die();
}

require_once "$root/server/config.php";
require_once "$root/server/accessors/appointmentAccessor.class.php";

if (isset($_REQUEST['action'])) {
	switch ($_REQUEST['action']) {
		case 'getAppointments': getAppointments($_GET['year']); break;
		case 'reschedule': rescheduleAppointment($_POST['id'], $_POST['appointmentTimeId']); break;
		case 'cancel': cancelAppointment($_POST['id']); break;
		default:
			die('Invalid action function. This instance has been reported.');
			break;
	}
}

function getAppointments($year) {
	GLOBAL $DB_CONN, $USER;

	$response = array();
	$response['success'] = true;

	$canViewClientInformation = $USER->isLoggedIn() && $USER->hasPermission('view_client_information');

	try {
		$query = 'SELECT Appointment.appointmentId, language, DATE_FORMAT(scheduledTime, "%b %D %l:%i %p") AS scheduledTime, 
			Site.title, firstName, lastName, TIME_FORMAT(timeIn, "%l:%i %p") AS timeIn, 
			TIME_FORMAT(timeReturnedPapers, "%l:%i %p") AS timeReturnedPapers, 
			TIME_FORMAT(timeAppointmentStarted, "%l:%i %p") AS timeAppointmentStarted, 
			TIME_FORMAT(timeAppointmentEnded, "%l:%i %p") AS timeAppointmentEnded, 
			completed, notCompletedDescription, servicedByStation, servicedAppointmentId ';
		if ($canViewClientInformation) {
			$query .= ', Client.phoneNumber, emailAddress ';
		}
		$query .= 'FROM Appointment
				LEFT JOIN ServicedAppointment ON Appointment.appointmentId = ServicedAppointment.appointmentId
				JOIN AppointmentTime ON Appointment.appointmentTimeId = AppointmentTime.appointmentTimeId
				JOIN Site ON AppointmentTime.siteId = Site.siteId
				JOIN Client ON Appointment.clientId = Client.clientId
			WHERE Appointment.archived = FALSE AND
				YEAR(AppointmentTime.scheduledTime) = ?
			ORDER BY AppointmentTime.scheduledTime';
	
		$stmt = $DB_CONN->prepare($query);
		$stmt->execute(array($year));
		$appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

		$filingStatusQuery = 'SELECT text
			FROM AppointmentFilingStatus
			JOIN FilingStatus ON AppointmentFilingStatus.filingStatusId = FilingStatus.filingStatusId
			WHERE AppointmentFilingStatus.servicedAppointmentId = ?';
		$filingStatusStmt = $DB_CONN->prepare($filingStatusQuery);
		foreach ($appointments as &$appointment) {
			// Shorten last name to only the initial if user doesn't have permission to view entire last name
			if (!$canViewClientInformation) {
				$appointment['lastName'] = substr($appointment['lastName'], 0, 1).'.'; // concat period since this is a last initial
			}
			$appointment['language'] = expandLanguageCode($appointment['language']);

			// Get appointment filing statuses
			$appointment['filingStatuses'] = array();
			if (isset($appointment['servicedAppointmentId'])) {
				$filingStatusStmt->execute(array($appointment['servicedAppointmentId']));
				$appointment['filingStatuses'] = $filingStatusStmt->fetchAll(PDO::FETCH_ASSOC);
			}
		}

		$response['appointments'] = $appointments;
	} catch(Exception $e) {
		$response['success'] = false;
		$response['error'] = 'There was an error loading the appointments on the server. Please refresh the page and try again.';
	}

	echo json_encode($response);
}

function rescheduleAppointment($appointmentId, $appointmentTimeId) {
	GLOBAL $DB_CONN;
	
	$response = array();
	$response['success'] = true;

	try {
		$query = "UPDATE Appointment
			SET appointmentTimeId = ?
			WHERE appointmentId = ?";
		$stmt = $DB_CONN->prepare($query);

		$success = $stmt->execute(array(
			$appointmentTimeId,
			$appointmentId
		));
		if ($success == false) {
			throw new Exception();
		}
	} catch (Exception $e) {
		$response['success'] = false;
		$response['error'] = 'There was an error rescheduling the appointment on the server. Please refresh the page and try again.';
	}

	echo json_encode($response);
}

function cancelAppointment($appointmentId) {
	$response = array();
	$response['success'] = true;

	try {
		$appointmentAccessor = new AppointmentAccessor();
		$appointmentAccessor->cancelAppointment($appointmentId);
	} catch (Exception $e) {
		$response['success'] = false;
		$response['error'] = 'There was an error cancelling the appointment on the server. Please refresh the page and try again.';
	}

	echo json_encode($response);
}

function expandLanguageCode($languageCode) {
	if ($languageCode === 'eng') return 'English';
	if ($languageCode === 'spa') return 'Spanish';
	if ($languageCode === 'vie') return 'Vietnamese';
	if ($languageCode === 'ara') return 'Arabic';
	return 'Unknown';
}