// JavaScript Document

// The possible activity types
var ActivityType = ["Presentation","Group Work","Discussion","Break"]

// This is an activity constructor
// When you want to create a new activity you just call
function Activity(name,length,typeid,description){
	var _name = name;
	var _length = length;
	var _typeid = typeid;
	var _description = description;
	
	// sets the name of the activity
	this.setName = function(name, model) {
		_name = name;
		model.notifyObservers();
	}

	// get the name of the activity
	this.getName = function(name) {
		return _name;
	}
	
	// sets the length of the activity
	this.setLength = function(length, model) {
		_length = length;
	}

	// get the name of the activity
	this.getLength = function() {
		return _length;
	}
	
	// sets the typeid of the activity
	this.setTypeId = function(typeid, model) {
		_typeid = typeid;
	}

	// get the type id of the activity
	this.getTypeId = function() {
		return _typeid;
	}
	
	// sets the description of the activity
	this.setDescription = function(description, model) {
		_description = description;
	}

	// get the description of the activity
	this.getDescription = function() {
		return _description;
	}
	
	// This method returns the string representation of the
	// activity type.
	this.getType = function () {
		return ActivityType[_typeid];
	};
}

// This is a day consturctor. You can use it to create days, 
// but there is also a specific function in the Model that adds
// days to the model, so you don't need call this yourself.
function Day(startH,startM) {
	this._start = startH * 60 + startM;
	this._activities = [];
	
	//Get all activities of the day
	this.getActivities = function() {
		return this._activities;
	}
	// sets the start time to new value
	this.setStart = function(startH,startM, model) {
		this._start = startH * 60 + startM;
		model.notifyObservers();
	}

	// returns the total length of the acitivities in 
	// a day in minutes
	this.getTotalLength = function () {
		var totalLength = 0;
		$.each(this._activities,function(index,activity){
			totalLength += activity.getLength();
		});
		return totalLength;
	};
	
	// returns the string representation Hours:Minutes of 
	// the end time of the day
	this.getEnd = function() {
		var end = this._start + this.getTotalLength();
		h = Math.floor(end/60);
		m = end % 60;
		if (h>=24){h = h-24};
		return h + ":" + m;
	};
	
	// returns the string representation Hours:Minutes of 
	// the start time of the day
	this.getStart = function() {
		return Math.floor(this._start/60) + ":" + this._start % 60;
	};
	
	// returns the length (in minutes) of activities of certain type
	this.getLengthByType = function (typeid) {
		var length = 0;
		$.each(this._activities,function(index,activity){
			if(activity.getTypeId() == typeid){
				length += activity.getLength();
			}
		});
		return length;
	};
	
	// adds an activity to specific position
	// if the position is not provided then it will add it to the 
	// end of the list
	this._addActivity = function(activity,position){
		if(position != null){
			this._activities.splice(position,0,activity);
		} else {
			this._activities.push(activity);
		}
	};
	
	// removes an activity from specific position
	// this method will be called when needed from the model
	// don't call it directly
	this.removeActivity = function(position, model) {
		act = this._activities.splice(position,1)[0];
		model.notifyObservers();	
		return act;
	};
	
	// moves activity inside one day
	// this method will be called when needed from the model
	// don't call it directly
	this._moveActivity = function(oldposition,newposition, model) {
		var activity = this.removeActivity(oldposition, model);
		this._addActivity(activity, newposition);
	};
}


// this is our main module that contains days and parked activities
function Model(){
	this.days = [];
	this.parkedActivities = [];

	// adds a new day. if startH and startM (start hours and minutes)
	// are not provided it will set the default start of the day to 08:00
	this.addDay = function (startH,startM) {
		var day;
		if(startH){
			day = new Day(startH,startM);
		} else {
			day = new Day(8,0);
		}
		this.days.push(day);
		this.notifyObservers();
		return day;
	};
	
	this.removeDay = function(i){
		this.days.splice(i, 1);
		this.notifyObservers();
	}
	
	// add an activity to model
	this.addActivity = function (activity,day,position) {
		if(day != null) {
			this.days[day]._addActivity(activity,position);
		} else {
			this.parkedActivities.push(activity);
		}
		this.notifyObservers();
	}
	
	// add an activity to parked activities
	this.addParkedActivity = function(activity){
		this.parkedActivities.push(activity);
		this.notifyObservers();
	};
	
	// remove an activity on provided position from parked activites 
	this.removeParkedActivity = function(position) {
		act = this.parkedActivities.splice(position,1)[0];
		this.notifyObservers();
		return act;
	};
	this.getParkedActivity = function(position) {
		act = this.parkedActivities[position];
		//this.notifyObservers();
		return act;
	};
	
	// moves activity between the days, or day and parked activities.
	// to park activity you need to set the new day to null
	// to move a parked activity to let's say day 0 you set oldday to null
	// and new day to 0
	this.moveActivity = function(oldday, oldposition, newday, newposition) {
		if(oldday !== null && oldday == newday) {
			this.days[oldday]._moveActivity(oldposition,newposition, this);

		}else if(oldday == null && newday == null) {
			var activity = this.removeParkedActivity(oldposition);
			this.addParkedActivity(activity,newposition);

		}else if(oldday == null) {
			var activity = this.getParkedActivity(oldposition);
			this.days[newday]._addActivity(activity,newposition);

		}else if(newday == null) {
			var activity = this.days[oldday].removeActivity(oldposition, this);
			this.addParkedActivity(activity);
		} else {
			var activity = this.days[oldday].removeActivity(oldposition, this);
			this.days[newday]._addActivity(activity,newposition);
		}
		this.notifyObservers();
	};
	
	//*** OBSERVABLE PATTERN ***
	var listeners = [];

	this.notifyObservers = function (args) {
	for (var i = 0; i < listeners.length; i++){
		listeners[i].update(args);
		}
	};

	this.addObserver = function (listener) {
		listeners.push(listener);
	};
	//*** END OBSERVABLE PATTERN ***
	}


// you can use this method to create some test data and test your implementation
function createTestData(model){
	model.addDay();
	model.addActivity(new Activity("Introduction",10,0,"Ettan"));
	model.addActivity(new Activity("Idea 1",30,0,"Tvåan"),0);
	model.addActivity(new Activity("Working in groups",35,1,"Lorem ipsum dolor sit amet, consectetur adipiscing elit."),0);
	model.addActivity(new Activity("Idea 1 discussion",15,2,"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in sagittis orci. Duis eleifend enim sagittis leo ultricies feugiat."));
	model.addActivity(new Activity("Coffee break",30,3,"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in sagittis orci. Duis eleifend enim sagittis leo ultricies feugiat. Nam a leo sed dui rutrum consectetur. Pellentesque a adipiscing dolor. Morbi eget arcu tristique, congue felis et, suscipit enim. Aliquam tempor elementum neque, sit amet commodo lorem bibendum non. Curabitur ullamcorper lectus ut massa rutrum consectetur. In eros arcu, scelerisque nec tempor quis, euismod quis nulla. Sed eu porttitor diam."),0);
}
