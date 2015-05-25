$(function() {

	var model = new Model(); // Create the model
	
	var activityPlanner = new ActivityPlanner($('#container'), model); // Create the basic view
	
	Overlay(); // Create and hide the overlay
	
	var controller = new Controller(activityPlanner, model); // Create the controller
	
	// Create test data
	createTestData(model);
});	

