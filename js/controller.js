var Controller = function(view, model) {

	$('#addDay').on('click', function(){
		model.addDay();
	});
	$('#addActivity').on('click', function(){
		fillOverlay(model, false, 'Add Activity', true);
	});
	
	$('#confirm').on('click', function(){
		if($(this).attr('method')=='confirm'){
			$('#overlay').modal('hide');
			return;
		}
		$().button('loading');
		
		// Get the values from the form
		var name = $('#addName').val();
		var length = $('#addLength').val();
		var desc = $('#addDesc').val();
		var type = $('#addType').val();
		var day = $('#addToDay').val();
		var oldDay = $('#addToDay').attr('oldDay');
		var pos = $('#addToDay').attr('pos');
		
		// reset the form
		$('#addName').val('');
		$('#addLength').val('');
		$('#addDesc').val('');
		$('#addType').val('');
		
		// Check if the length value is a number
		if(!$.isNumeric(length) || length > 1439){
			fillOverlay(model, 'Please enter a numeric character inbetween 0 and 1439 minutes', "You're doing it wrong");
			return;
		}
		
		//Check whether we're updating an activity or creating a new one
		
		if($(this).attr('method')=='addActivity'){	 // add the activity
			if (day == 'null'){
					day = null;
			}
			model.addActivity(new Activity(name, parseInt(length), type, desc), day);
		}
		
		else if($(this).attr('method')=='editActivity'){

			// Check if the activiry is from or going to the parked activities
			if(oldDay == 'null'){oldDay = null};
			if(day == 'null'){day = null};
			
			
			if(oldDay){ //Get the activity from the day
				var act = model.days[oldDay].getActivities()[pos];
			}
			else { // or from the parked ones
				var act = model.getParkedActivity(pos);
			}

			// make sure the total time of the day after the change doesn't exceed 24 hours
			// then enter the activity into the model
			if(day){ 
				if(timeCheck(length, day, model)){
					act.setLength(parseInt(length), model);
					act.setTypeId(type, model);
					act.setDescription(desc, model);	
					act.setName(name, model);
					if(day !== oldDay){
						model.moveActivity(oldDay, pos, day, null);
					}
				}
			}
			else if (!day){ // we dont care about the length of the actitvity if it's parked
				act.setLength(parseInt(length), model);
				act.setTypeId(type, model);
				act.setDescription(desc, model);	
				act.setName(name, model);
				if(day !== oldDay){
					model.moveActivity(oldDay, pos, day, null);
				}
			}
		}
		
		$('#overlay').modal('hide'); // hide the overlay
	
	});
		
	$('#left').on('click', function(){ // scroll the days to the left
		updateTables($('#container'), model, parseInt($(this).attr('n')), view);
	});
	$('#right').on('click', function(){ // scroll the days to the right
		updateTables($('#container'), model, parseInt($(this).attr('n')), view);
	});
	
	$('#helpBtn').on('click', function(){ // Generate the help message
		fillOverlay(model, '<h4>Welcome to Activity Planner</h4><p><ul><li>Managing Activities: <ul><li> In order to create a new activity simply press the Add Activity Button in the menu bar.</li><li>You can move one activity from parked activities to several days. Just remember that if you update one of the copies they will all get updated.</li><li>If you want to edit only one activity please create a new </li></ul><li>Days</li><ul><li>You can add new days to the planner by pressing the Add a Day button</li><li>You can change the start time of the day by changing the value in the start time field located at the top of the day field</li><li>A day cannot contain more than 24 hours or 1440 minutes of activities</li></ul></li></ul>', 'Instructions');
	});
}

function timeCheck(length, newDay, model){
	if(newDay){ //Calculate the total time of the day after we change /add an activity to make sure it doesn't exceed 24 hours
		if(
		(
		parseInt(length) + 
		parseInt(model.days[newDay].getTotalLength()) + 
		parseInt(model.days[newDay].getStart().split(':')[0]*60) + 
		parseInt(model.days[newDay].getStart().split(':')[1])
		)
		>= 1440){
			fillOverlay(model, 'If you add this activity to this day the total time will spill over into the next day. Please create a new day to contine planning your time.', "You're doing it wrong");
			return false;
		}
		
	}
	return true;
}
function dragAndDrop (model){	

	$('.tableClass tr').droppable({ //Make our table rows droppable
		drop: function(event, ui) { 
			var newDay = this.getAttribute('day'); // get the new days' number
			var oldPos = ui.draggable.attr('pos'); //Get the days' old position

			var newPos = this.getAttribute('pos');
		
			if (ui.draggable.attr('day')){ // Check if the day is dropped in the parked activities or not
				var oldDay = ui.draggable.attr('day');
			}else{
				var oldDay = null;

			}
			if ((oldDay == null) && (newDay == null)){ // we dont bother with sorting in the parked activities
				return;
			}
			if(oldDay){ //Check that the total time of the day doesn't exceed 24 hours
				if(timeCheck(model.days[oldDay].getActivities()[oldPos].getLength(), newDay, model)){
					model.moveActivity(oldDay, oldPos, newDay, newPos);
					$(c.tr).remove();			// Delete the clone
					$(c.helper).remove();	// Delete the clone
				}
			}
			else{ //Check that the total time of the day doesn't exceed 24 hours
				if(timeCheck(model.getParkedActivity(oldPos).getLength(), newDay, model)){
					model.moveActivity(oldDay, oldPos, newDay, newPos);
					$(c.tr).remove(); 
					$(c.helper).remove();
				}	
			}
		}
		
	});
	$('.filler').droppable({ // Make the empty space in the bottom of the day droppable
		drop: function(event, ui) { 
			var newDay = this.getAttribute('day'); // GEt the data
			var oldPos = ui.draggable.attr('pos');
			var newPos = null;
		
			if (ui.draggable.attr('day')){ //Check where it comes from
				var oldDay = ui.draggable.attr('day');
			}else{
				var oldDay = null;
			}
			if ((oldDay == null) && (newDay == null)){ // Dont sort parked activities
				return;
			}
			if(oldDay){ // Check total length of the day
				if(timeCheck(model.days[oldDay].getActivities()[oldPos].getLength(), newDay, model)){
					model.moveActivity(oldDay, oldPos, newDay, newPos);
					$(c.tr).remove();
					$(c.helper).remove();
				}
			}
			else{
				if(timeCheck(model.getParkedActivity(oldPos).getLength(), newDay, model)){
					model.moveActivity(oldDay, oldPos, newDay, newPos);
					$(c.tr).remove();
					$(c.helper).remove();
				}	
			}
		}
	});
	var c = {};
	$('.dropDiv tr').draggable({ // Make the table rows draggable
		    helper: "clone", //create a clone for visual representation
		    start: function(event, ui) {
			c.tr = this;
			c.helper = ui.helper;
			}
	});
}
function dynamicListeners(model){

		$('.dayData input').on('change', function(){ // function to run if we change the start time of a day
			var time = $(this).val().split(':');
			var day = $(this).attr('day');
			var oldTime = model.days[day].getStart().split(':');
			
			h = time[0];
			m = time[1];
			// check if the values are numbers
			if (h >= 24 || (!$.isNumeric(h)) || (!$.isNumeric(m))){
				fillOverlay(model, 'Please enter a time between 00:00 and 23:59. Please only enter numbers in the following format: hh:mm.', "You're doing it wrong");
			}
			else if (timeCheck(((h-oldTime[0])*60 + (m-oldTime[1])), day, model) ){
				model.days[day].setStart(parseInt(h), parseInt(m), model); // enter correct input into model
				return;
			}
			var time = oldTime; // reset the time in the field if the entered value is bad
			
			time = (parseInt(time[0])*60 + parseInt(time[1]))+length;
			h = Math.floor(time/60);
			
			while (h>=24){	h = h-24;	}
			if( h < 10 ) { h = "0"+h; }
			if ((time % 60) < 10){	m = "0" + time%60;	}
			else{	m = time%60;	}
			
			time = (h +":"+ m);
			
			$(this).val(time);
			return;
		});
		
		$('.panel-heading button').on('click', function(){ // remove the day
			var day = $(this).attr('day');
			model.removeDay(day);
		});
		
		$('.tableClass button').on('click', function(){ //Delete an activity
			var day = $(this).attr('day');
			var pos = $(this).attr('pos');
			if (day == 'null'){
				model.removeParkedActivity(pos);
			}
			else{
				model.days[day].removeActivity(pos, model);
			}
		});
		
		$('.tableClass tr').on('dblclick', function(){ // Edit an activity by double clicking on it
			
			var day = $(this).attr('day');
			var pos = $(this).attr('pos');
			
			if(day){ //get the day from days or from parked
				var act = model.days[day].getActivities()[pos];
			}
			else{
				var act = model.getParkedActivity(pos);
				day = 'null';
			}
		
			// get the activitydata and add it to the form in the overlay
			fillOverlay(model, [act, day, pos], 'Edit Activity', true);
		});
		
}
