function mattbullshitrenderemail(email) {
	console.log("Rendering", email);
	var div = $('#emailPreview');

	$(document.createElement('div'))
		.html('From: ' + email['from'])
		.appendTo($(div));
	$(document.createElement('div'))
		.html('To: (your partner)')
		.appendTo($(div));

	$(document.createElement('div'))
		.html('Subject: ' + email['subject'])
		.appendTo($(div));

	$(document.createElement('div'))
		.html(email['body'])
		.appendTo($(div));
}

function renderEmail(email) {
	/** 
	 * Given an object representing an email, render it.
	 */
	mattbullshitrenderemail(email);
}
