function mattsbullshitrender(sti_dict) {

	// TODO: Noah, this is all you; I just made this as a placeholder
	console.log('render', sti_dict);

	function getInputs(key, dict, keynames, allowModify, allowDelete) {
		// create the input values and a 'submit' function
		var inputs = [];
		$.each(keynames, function(idx, keyname) {
				var input = document.createElement('input');
				input.type = 'text';
				input.value = dict[keyname] || '';
				input.name = keyname;
				$(input).attr('position', idx);
				if ('id' in dict)
					$(input).attr('id', dict['id']);

				inputs.push(input);
			});

		if (allowModify) {
			var modify = document.createElement('span');
			$(modify)
				.addClass('dashboard-stis-single-modify')
				.html('modify')
				.click(function() {
						// build up a dict and submit the modifications
						var submit_dict = {};
						submit_dict[key] = [];
						
						var submit_obj = {};
						$.each(inputs, function(idx, input) {
								if (input.name) {
									submit_obj[input.name] = input.value;
									submit_obj['position'] = $(input).attr('position');
									if ($(input).attr('id'))
										submit_obj['id'] = $(input).attr('id');
								}
							});
						submit_dict[key].push(submit_obj);

						modifySTIAttributes(sti_dict['sti_id'], submit_dict,
											function (data) {
												console.log('modify ajax request got...', data);
											});
					});
			inputs.push(modify);
		}

		if (allowDelete) {
			var del = document.createElement('span');
			$(del)
				.addClass('dashboard-stis-single-delete')
				.html('delete')
				.click(function() {
						// just delete this sub-object (TODO: delete row and/or clear inputs)
						var submit_dict = {};
						submit_dict[key] = [];
						
						if (dict['id']) {
							submit_dict[key].push(dict['id']);
							
							deleteSTIAttributes(sti_dict['sti_id'], submit_dict,
											function (data) {
												console.log('delete ajax request got...', data);
											});
						}
					});
			inputs.push(del);

		};
		return inputs;
	}

	function addTitle(div, title) {
		$(document.createElement('div'))
			.html(title)
			.addClass('dashboard-stis-single-section-header')
			.appendTo(div);
	}
	
	function addRow(table, values, clss) {
		var tr = table.insertRow(-1);
		$.each(values, function(idx, value) {
				var td = tr.insertCell(-1);
				if (clss)
					$(td).addClass(clss);

				$(td).append(value);
			});
	}

	if (!sti_dict['sti_id']) {
		// shortcut; create the STI, then we can add stuff to it
		addTitle($('#sti_basic'), 'New STI');
		$('#sti_basic').append(
			'<form action="" method="POST">'
			+ '<input type="hidden" name="csrfmiddlewaretoken" value="'+ $(document).attr('csrfmiddlewaretoken')+'"></input>'
			+ 'Name <input name="name" type="text"></input><br>'
			+ 'Email Sentence <input name="emailSentence" type="text"></input><br>'
			+ 'Email Paragraph <input name="emailParagraph" type="text"></input>'
			+ '<input type="submit" value="Create"></input>'
			+ '</form>')
		
		return;
	}

	/* render basic */
	addTitle($('#sti_basic'), sti_dict['sti']['name']);
	var basic_table = document.createElement('table');
	addRow(basic_table, ['Name', 'Email Sentence', 'Email Paragraph'], 'dashboard-stis-single-row-header');
	addRow(basic_table, getInputs('sti', sti_dict['sti'], ['name', 'emailSentence', 'emailParagraph'], true, false), 'dashboard-stis-single-row-header');	
	$(basic_table)
		.addClass('dashboard-stis-single-table').
		appendTo($('#sti_basic'));

	/* render description */
	addTitle($('#sti_description'), 'Description');
	var basic_table = document.createElement('table');
	addRow(basic_table, ['Question', 'Answer'], 'dashboard-stis-single-row-header');
	$.each(sti_dict['description'], function(idx, description) {
			addRow(basic_table, getInputs('description', description, ['question', 'answer'], true, true), 'dashboard-stis-single-row-header');	
		});
	addRow(basic_table, getInputs('description', {}, ['question', 'answer'], true, true), 'dashboard-stis-single-row-header');

	$(basic_table)
		.addClass('dashboard-stis-single-table').
		appendTo($('#sti_description'));

	/* render symptoms */
	addTitle($('#sti_symptom'), 'Symptoms');
	var basic_table = document.createElement('table');
	addRow(basic_table, ['Name', 'Appearance Info'], 'dashboard-stis-single-row-header');
	$.each(sti_dict['symptom'], function(idx, symptom) {
			addRow(basic_table, getInputs('symptom', symptom, ['name', 'appearanceInfo'], true, true), 'dashboard-stis-single-row-header');	
		});
	addRow(basic_table, getInputs('symptom', {}, ['name', 'appearanceInfo'], true, true), 'dashboard-stis-single-row-header');	

	$(basic_table)
		.addClass('dashboard-stis-single-table').
		appendTo($('#sti_symptom'));

	/* render transmission info */
	addTitle($('#sti_transmission'), 'Transmission Info');
	var basic_table = document.createElement('table');
	addRow(basic_table, ['Means', 'Likelihood', 'Likelihood (text description)'], 'dashboard-stis-single-row-header');
	$.each(sti_dict['transmission'], function(idx, transmission) {
			addRow(basic_table, getInputs('transmission', transmission, ['means', 'likelihoodValue', 'likelihoodText'], true, true), 'dashboard-stis-single-row-header');	
		});
	addRow(basic_table, getInputs('transmission', {}, ['means', 'likelihoodValue', 'likelihoodText'], true, true), 'dashboard-stis-single-row-header');	

	$(basic_table)
		.addClass('dashboard-stis-single-table').
		appendTo($('#sti_transmission'));

	/* render testing info */
	addTitle($('#sti_testing'), 'Testing Info');
	var basic_table = document.createElement('table');
	addRow(basic_table, ['Window', 'Procedure'], 'dashboard-stis-single-row-header');
	$.each(sti_dict['testing'], function(idx, testing) {
			addRow(basic_table, getInputs('testing', testing, ['testingWindow', 'testingProcedure'], true, true), 'dashboard-stis-single-row-header');
		});
	addRow(basic_table, getInputs('testing', {}, ['testingWindow', 'testingProcedure'], true, true), 'dashboard-stis-single-row-header');

	$(basic_table)
		.addClass('dashboard-stis-single-table').
		appendTo($('#sti_testing'));

}

/* BEGIN Backend API */

/* Entry point */
function renderSti(sti_dict) {
	/**
	 * sti_dict has the following keys:
	 * 
	 * "sti_id": the primary key of the STI (this key isn't present if
	 *           we're creating a new STI)
	 * "description": a list of description objects to be rendered (in order)
	 * "symptom": a list of symptom objects to be rendered (in order)
	 * "testing": a list of transmission objects to be rendered (in order)
	 * "testing": a list of testing objects to be rendered (in order)
	 */
	console.log("Hey, I'm rendering an STI:", sti_dict);

	// TODO Noah, write this.
	mattsbullshitrender(sti_dict);
}

function modifySTIAttributes(sti_id, attributes, callback) {
	/**
	 * Modifies the given STI and its attributes.
	 * 
	 * sti_id is the primary-key of the STI you want to modify
	 * attributes is a dictionary of the following format:
	 *     {"description": [{"id":"description_id1", "key1": "value1" ...},
	 *                      {"id":"description_id2", "key1": "value1" ...}],
	 *      "testing": [{"id":"testing_id1", "key1": "value1" ...},
	 *                  {"id":"testing_id2", "key1": "value1" ...}],
	 *      "symptom": [...],
	 *      "transmission": [...]}
	 *
	 * The keys of the dictionary must be a subset of ["description",
	 * "testing", "symptom", "transmission"], but you don't necessarily
	 * have to include all keys.
	 *
	 * The values are a list of changes to send out.  For example,
	 * "description": [{"id": 10, "question": "hello?"}, {"id":5, "question": "are you there?"}]
	 *
	 * ...changes question on the description with id 10 to "hello?" and the
	 * question on the description with id 5 to "are you there?"
	 * 
	 * Upon return, calls callback(data), where data is the JSON dict that
	 * is returned from the request.
	 */
	makeAjaxRequest($(document).attr('uri_modifystiattrs'),
					{'id': sti_id, 'attributes': JSON.stringify(attributes)},
					callback);
}

function deleteSTIAttributes(sti_id, attributes, callback) {
/**
	 * Modifies the given STI and its attributes.
	 * 
	 * sti_id is the primary-key of the STI you want to modify
	 * attributes is a dictionary of the following format:
	 *     {"description": [2, 5, 12],
	 *      "testing": [4, 3],
	 *      "symptom": [...],
	 *      "transmission": [...]}
	 *
	 * The keys of the dictionary must be a subset of ["description",
	 * "testing", "symptom", "transmission"], but you don't necessarily
	 * have to include all keys.
	 *
	 * The values are a list of ids to delete.  For example,
	 * "testing": [4, 3]
	 *
	 * ...deletes the testing instances with ids 4 and 3.
	 * 
	 * Upon return, calls callback(data), where data is the JSON dict that
	 * is returned from the request.
	 */
	makeAjaxRequest($(document).attr('uri_deletestiattrs'),
					{'id': sti_id, 'attributes': JSON.stringify(attributes)},
					callback);
}

/* END Backend API */
