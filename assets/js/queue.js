var REFRESH_SEC = 15,
	displayDate = new Date(),
	monthStrings = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
	refreshing = null;

$(document).ready(refresh);

function refresh() {
	keepTime();
	displayQueueDate();
	populateQueue();

	clearTimeout(refreshing);
	refreshing = setTimeout(refresh, REFRESH_SEC * 1000);
}

function keepTime() {
	var h = new Date().getHours(),
		m = new Date().getMinutes();

	$('.clock-am').toggleClass('inactive-period', h >= 12);
	$('.clock-pm').toggleClass('inactive-period', h < 12);

	h %= 12;
	if (h === 0) h = 12;
	if (m < 10) m = `0${m}`;
	$('.clock-time').html(`${h}:${m}`);
}