function makeAjaxRequest(uri, request, callback) {
	/**
	 * Makes an AJAX request with a JSON payload and calls the callback
	 * when the information is returned.  Adds the csrfmiddlewaretoken to
	 * the request so we can use Django's ability to dodge a XSS attack.
	 */
	request['csrfmiddlewaretoken'] = $(document).attr('csrfmiddlewaretoken');
	$.post(uri, request, callback, 'json');
}
