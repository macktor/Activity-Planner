function fillOverlay(model, text, title, activity){
	// text == string and activity == false when you've clicked on help or done a faulty input
	// activity == true when you've clicked add activity or double clicked an existing activity
	// text == array when you've double clicked an activity

	var ActivityType = ["Presentation","Group Work","Discussion","Break"];
	
	overlay = $('#overlay');
	overlay.find('#modal-title').html(title); // set the title
	
	if(activity){ // Will only be true when you either click on Add Activity or Double Click on an activity in order to update it
		var body = overlay.find('.modal-body');
		body.empty(); // Clear the body
		
		// Name
		// Setting up the div, input and textspan
		var inputDiv = $('<div>');
		var inputSpan = $('<span>');
		var input = $('<input>');
		
		inputDiv.attr('class', 'input-group');
		inputSpan.attr('class', 'input-group-addon');
		input.attr('class', 'form-control');
		input.attr('type', 'text');
		input.attr('maxlength', '20');
		input.attr('id', 'addName');

		inputDiv.append(inputSpan);
		inputDiv.append(input);
		inputSpan.html('&nbsp;Name&nbsp;&nbsp;');
		body.append(inputDiv);
		
		//Length
		// Setting up the div, input and textspans
		var inputDiv = $('<div>');
		var inputSpan = $('<span>');
		var input = $('<input>');
		
		inputDiv.attr('class', 'input-group');
		inputSpan.attr('class', 'input-group-addon');
		input.attr('class', 'form-control');
		input.attr('type', 'text');
		input.attr('maxlength', '4');
		input.attr('id', 'addLength');

		inputDiv.append(inputSpan);
		inputDiv.append(input);
		inputSpan.html('&nbsp;Length');
		body.append(inputDiv);
		
		var inputSpan = $('<span>');
		inputSpan.attr('class', 'input-group-addon');
		inputSpan.html('Minutes');
		inputDiv.append(inputSpan);
		
		//Type
		// Setting up the div, select and textspan
		var inputDiv = $('<div>');
		var inputSpan = $('<span>');
		var select = $('<select>');
		
		inputDiv.attr('class', 'input-group');
		inputSpan.attr('class', 'input-group-addon');
		select.attr('class', 'form-control');
		select.attr('type', 'text');
		select.attr('maxlength', '20');
		select.attr('id', 'addType');

		inputDiv.append(inputSpan);
		inputDiv.append(select);
		inputSpan.html('&nbsp;Type &nbsp;&nbsp;');
		body.append(inputDiv);
		
		for(var i = 0; i<4; i++){
			var option = $('<option>');
			option.attr('value', i);
			option.html(ActivityType[i]);
			select.append(option);
		}
		
		//Description
		// Setting up the div and the textarea
		var input = $('<textarea>');
		
		input.attr('class', 'form-control');
		input.attr('rows', '5');
		input.attr('id', 'addDesc');
		input.attr('placeholder', 'Description');

		inputDiv.append(input);
		body.append(input);
		
		//Day
		// Setting up the div, select and textspan. Updates the select choices dynamically 
		var inputDiv = $('<div>');
		var inputSpan = $('<span>');
		var select = $('<select>');
		inputSpan.html('&nbsp;&nbsp;Day&nbsp;&nbsp;');
		select.attr('class', 'form-control');
		select.attr('id', 'addToDay');
		select.attr('pos', '');
		
		var option = $('<option>');
		option.attr('value', 'null');
		option.html('Park Activity');
		select.append(option);
		
		for (var i = 0; i<model.days.length; i++){
			var option = $('<option>');
			option.attr('value', i);
			option.html('Day ' + parseInt(i+1));
			select.append(option);
		}
		inputDiv.append(inputSpan);
		inputDiv.append(select);
		body.append(inputDiv);
		
		overlay.find('#confirm').attr('method', 'addActivity');
		
		if (text){ // Will only be true when the user double clicks an activity to edit it
			var act = text[0];  // Gets the activity,
			var day = text[1]; // day number
			var pos = text[2]; // and position from the array
			
			// Enter the current information in the form fields
			$('#addName').val(act.getName());
			$('#addLength').val(act.getLength());
			$('#addType').val(act.getTypeId());
			$('#addDesc').val(act.getDescription());
			$('#addToDay').val(day);
			$('#addToDay').attr('oldDay', day);
			$('#addToDay').attr('pos', pos);
			
			overlay.find('#confirm').attr('method', 'editActivity'); // change the function of the confirm button
		}
		
	}
	else{
		// If the activity variable isn't set, simply add the passed text to the view and make the button into a confirm button
		overlay.find('.modal-body').html(text);
		overlay.find('#confirm').attr('method', 'confirm');
	}
	overlay.modal('show');
}