function addConfigKV(key, value, append) {
	// TODO: Noah, this is all you; I just made this as a placeholder
	var position = 0;
	if (append) {
		position = -1;
	} else {
		// find the position so we insert the keys sorted in alphabetical order
		$.each($('#configtable').find('tr'), function(idx, row) {
				var elem = $(row).find('.config-key')[0];
				if (!elem)
					return;

				if (elem.innerHTML < key) 
					position += 1;
				// TODO for now, remove duplicate entries (new values take precedence); 
				// figure out something better with this later on
				if (elem.innerHTML == key)
					$(row).remove();
			});
	}
	var row = $('#configtable')[0].insertRow(position);

	$(row.insertCell(-1))
		.addClass('config-key')
		.html(key);

	var input = document.createElement('input');
	input.type = 'text';
	input.value = value;
	$(row.insertCell(-1))
		.addClass('config-value')
		.append(input);

	$(row.insertCell(-1))
		.addClass('config-update')
		.html('update')
		.click(function() { 
				var inputval = $(row).find('.config-value input')[0].value;

				modifyConfig(key, inputval,
							 function(data) {
								 if (data['status'] == 'ok') {
									 console.log("TODO highlight new value? some visualization thing...");
								 } else {
									 console.log("TODO show error", data);
								 }
							 });
			});

	$(row.insertCell(-1))
		.addClass('config-delete')
		.html('delete')
		.click(function() {
				deleteConfig(key,							
							 function (data) {
								 if (data['status'] == 'ok') {
									 $(row).remove();
								 } else {
									 console.log("TODO show error", data);
								 }
							 });
			});
}

function mattsbullshitrender(configList) {
	// TODO: Noah, this is all you.  I just made this as a placeholder.
	$.each(configList, function(idx, elem) {
			addConfigKV(elem[0], elem[1], true);
		});

	var row = $('#configtable')[0].insertRow(-1);

	$(row.insertCell(-1))
		.addClass('config-newkey')
		.html('<input type="text">');
	
	$(row.insertCell(-1))
		.addClass('config-newvalue')
		.html('<input type="text">');

	$(row.insertCell(-1))
		.addClass('config-add')
		.html('add')
		.click(function() { 
				var keyinput = $(row).find('.config-newkey input')[0];
				var valueinput = $(row).find('.config-newvalue input')[0];

				modifyConfig(keyinput.value, valueinput.value,							 
							 function(data) {
								 if (data['status'] == 'ok') {
									 addConfigKV(keyinput.value, valueinput.value);
									 $(keyinput).val('');
									 $(valueinput).val('');
								 } else {
									 console.log("TODO show error", data);
								 }
							 });
			});

}

/* BEGIN Backend API */

/* Entry point */
function renderConfiguration(config) {
	/**
	 * config is just a list of all key,value pairs in the configuration
	 * [[key, value], [key, value], ...]
	 * 
	 * It's currently sorted alphabetically by key, but you can do
	 * whatever you want.
	 */
	console.log("Hey, I'm rendering a config:", config);

	// TODO Noah, write this.
	mattsbullshitrender(config);
}

function modifyConfig(key, value, callback) {
	/** 
	 * Given a key/value pair, inserts it into the config.  If the key
	 * already exists, its value is replaced with this value.
	 *
	 * Upon return, calls callback(data), where data is the JSON dict that
	 * is returned from the request.
	 */
	makeAjaxRequest($(document).attr('uri_modifyconfigkv'),
					{'key': key, 'value': value},
					callback);
}

function deleteConfig(key, callback) {
	/** 
	 * Deletes the given key from the configuration.  If the key does not
	 * exist, this will come up as an error in the returned JSON.
	 *
	 * Upon return, calls callback(data), where data is the JSON dict that
	 * is returned from the request.
	 */
	makeAjaxRequest($(document).attr('uri_deleteconfigkv'),
					{'key': key},
					callback);
}

/* END Backend API */
