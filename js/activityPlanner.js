var ActivityPlanner = function(container, model){
	this.start = 0;
	model.addObserver(this);
	//This function gets called when there is a change in the model
	this.update = function(arg){
		updateTables(container, model, parseInt(this.start), this);
	}
	this.setStart = function(i){
		this.start = i;
	}
}

//updates the activitytables
function updateTables(container, model, start, view){
	//Creates a day table
	view.setStart(start); // decides wheter there should be two or three days visible at once based on screen width
	if ($(document).width() < 1520){
		stop = parseInt(start+2);
	}
	else {
		stop = parseInt(start+3);
	}
	
	var actDiv = container.find($('#activities'));
	actDiv.empty();
	var table = $('<table>');
	table.attr('id','activityTable');
	table.attr('class','tableClass table');
	//Fill parked activities with table rows
	for (var i=0;i<model.parkedActivities.length; i++){
		var activity = model.parkedActivities[i];
		displayActivity(table, activity.getTypeId(), activity.getName(), activity.getLength(),activity.getDescription(), null, i);
	}
	//dynamically set the height of the filler div based on the amount of activities in the table
	var fillDiv = $('<div>');
	fillDiv.css('height', Math.max(47, 450 - model.parkedActivities.length*47));
	fillDiv.attr('class', 'filler');
	
	actDiv.append(table);
	actDiv.append(fillDiv);
	
	container.find('#allDays').empty();
	
	//Create divs and tables for each day that are supposed to be visible
	for (var i = start; i < Math.min(stop, model.days.length); i++){
	
		var typeTime = [0,0,0,0];
		var mDiv = $('<div>');
		var mDiv2 = $('<div>');
		mDiv.attr('class','mainDiv');
		mDiv2.attr('class', 'panel panel-default');
		mDiv.attr('id', 'mD'+i); //give the all a unique ID 
		
		var table = $('<table>');
		table.attr('class', 'dayData');
		
		var hDiv = $('<div>');
		hDiv.attr('class', 'panel panel-heading');
		hDiv.attr('day', i);	 
		hDiv.html('<span class="text-info"><strong>Day ' + parseInt(i+1) + '<button type="button" day="'+i+'" class="close" aria-hidden="true" >&times;</button></strong></span>');
		mDiv2.append(hDiv);
		
		var tr = $('<tr>');
		var td = $('<td>');
		td.html('Start time: ');
		tr.append(td);
		var td = $('<td>');
	
		var startTime = model.days[i].getStart();
		var time = startTime.split(':');
		time = (parseInt(time[0])*60 + parseInt(time[1]))+length;
		h = Math.floor(time/60);
		
		if (h>=24){	h = h-24;	}
		else if( h < 10 ) { h = "0"+h; }
		if ((time % 60) < 10){	m = "0" + time%60;	}
		else{	m = time%60;	}
		
		startTime = (h +":"+ m);
		
		td.html('<input day='+i+' class="form-control" value="' + startTime + '"></input>');
		tr.append(td);
		var td = $('<td>');
		tr.append(td);
		table.append(tr);
	
		var tr = $('<tr>');
		var td = $('<td>');
		td.html('End time: ');
		tr.append(td);
		var td = $('<td>');
		td.attr('id', 'endTime');
		
		// fix the time output eg. 08:00 instead of 8:0
		var time = model.days[i].getEnd().split(':');
		time = (parseInt(time[0])*60 + parseInt(time[1]))+length;
		h = Math.floor(time/60);
		
		if (h>=24){	h = h-24;	}
		else if( h < 10 ) { h = "0"+h; }
		if ((time % 60) < 10){	m = "0" + time%60;	}
		else{	m = time%60;	}
		time = (h +":"+ m);
		
		td.html(time);	
		tr.append(td);
		table.append(tr);

		var tr = $('<tr>');
		var td = $('<td>');
		td.html('Total length: ');
		tr.append(td);
		var td = $('<td>');
		td.attr('totalTime');
		td.html(model.days[i].getTotalLength() + ' min');
		tr.append(td);
		table.append(tr);

		var div = $('<div>');
		div.attr('id', 'day');
		div.attr('class', 'dropDiv panel panel-body');
		div.attr('day', i);
		
		div.append(table);

		var table2 = $('<table>');
		table2.attr('id', 'daytable'+i);
		table2.attr('class', 'tableClass table');
		div.append(table2);
		mDiv2.append(div);
		
		var act = model.days[i].getActivities(); 
		var actTime = startTime;
		for (var j=0; j<act.length;j++){ //Create tablerows for each activity and attach them to thier table
			actTime = displayActivity(table2, act[j].getTypeId(), act[j].getName(), act[j].getLength(), act[j].getDescription(), i, j, actTime);
			typeTime[act[j].getTypeId()] += act[j].getLength();
		}
		
		var fillDiv = $('<div>');
		fillDiv.attr('day', i);
		fillDiv.css('height', Math.max(47, 350 - act.length*47));
		fillDiv.attr('class', 'filler');
		div.append(fillDiv);
		
		var pDiv = $('<div>');
		pDiv.attr('class', 'progress');
		// Create the progressbar to show the time allocation inbetween the different activity types
		var progressColors = ['success', 'danger', 'info','warning']
		for (var j = 0; j < 4; j++){
			var prDiv = $('<div>');
			prDiv.attr('class', 'progress-bar progress-bar-'+progressColors[j]);
			prDiv.attr('style', 'width: '+100*typeTime[j]/model.days[i].getTotalLength() +'%');
			pDiv.append(prDiv);
		}
		
		mDiv2.append(pDiv);
		
		// Warning div that appears if you dont have enough breaktime
		var wDiv = $('<div>');
		wDiv.attr('class', 'alert alert-danger alert-dismissable');
		wDiv.html('Not enough breaks, Please make sure at least 30% of your planned time consists of breaks!');
		mDiv2.append(wDiv);
		
		if ( Math.floor(100*typeTime[3]/model.days[i].getTotalLength()) < 30){
			wDiv.css('display', 'block');
		}
		mDiv.append(mDiv2);
		container.find('#allDays').append(mDiv);
		
		
	}
	
	// Set the left and right toggle buttons and disable them when there isn't enough days
	$('#left').attr('n', start-1);
	$('#right').attr('n', start+1);
	if (start == 0){
		$('#left').prop('disabled', true);
	}
	else{
		$('#left').prop('disabled', false);
	}
	
	if(stop >= model.days.length){
		$('#right').prop('disabled', true);
	}
	else{
		$('#right').prop('disabled', false);
	}
	// Make your new tablerows draggable and droppable
	dragAndDrop(model);
	// Attach listeners to your new buttons
	dynamicListeners(model);
}

//handles the creation, formating and coloring of the table rows
function displayActivity(table, id, name, length, desc, day, pos, startTime){
	
	var id = parseInt(id,10);	
	var tr = $('<tr>');
	if(day !== null){
		tr.attr('day', day);
	}
	tr.attr('pos', pos);
	tr.attr('id', day+""+pos);
	var td = $('<td>');
	if(startTime){ // Fix time display
		var time = startTime.split(':');
		time = (parseInt(time[0])*60 + parseInt(time[1]))+length;
		h = Math.floor(time/60);
		
		while (h>=24){	h = h-24;	}
		if( h < 10 ) { h = "0"+h; }
		if ((time % 60) < 10){	m = "0" + time%60;	}
		else{	m = time%60;	}
		
		time = (h +":"+ m);
		td.html('<span class="badge time">' +startTime+'</span>');
	}else{
		td.html('<span class="badge time">' + length + ' Min</span>');
	}
	td.attr('width', '25%');
	td.css('padding-left', '10px');
	tr.append(td);
	
	var td = $('<td>');
	var p = $('<p>');

	td.attr('colspan', '4');
	var a = $('<a>');
	tr.attr('class', 'pop');
	p.html(name);
	td.append(p);
	
	var fullDesc =  desc ;
	
	// Attach a unique popover info box
	tr.popover({
        placement: 'right',
        html: 'true',
        title : '<span class="text-info"><strong>'+name+'</strong></span>'+
                '<button type="button" id="close" class="close" onclick="$(&quot;#example&quot;).popover(&quot;hide&quot;);">&times;</button>',
        content : fullDesc,
		trigger: 'hover'
    });
	
	switch(id){ // Set the color of the table row
		case 0:
			var color = '#5cb85c';
			break;
		case 1:
			var color = '#d9534f';
			break;
		case 2:
			var color = '#5bc0de';
			break;
		case 3:
			var color = '#f0ad4e';
			break;
	}
	
	tr.append(td);
	var td = $('<td>');
	td.html('<button type="button" day="'+day+'" pos="'+pos+'" class="close" aria-hidden="false" >&times;</button>');
	tr.css('background-color', color);
	tr.append(td);
	table.append(tr);
	return time
}
