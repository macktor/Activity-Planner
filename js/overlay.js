function Overlay(){	
	// Create ALL the DIVS
	var fadeDiv = $('<div>');
	var dialogDiv = $('<div>');
	var contentDiv = $('<div>');
	var headDiv = $('<div>');
	var bodyDiv = $('<div>');
	var footDiv = $('<div>');
	var buttonDiv = $('<div>');
	var title = $('<h4>');
	var cButton = $('<button>');
	var dButton = $('<button>');
	var pButton = $('<button>');
	
	// Add all the necessary attributes
	fadeDiv.attr('id','overlay');
	fadeDiv.attr('class', 'modal fade');
	fadeDiv.attr('tabindex', '-1');
	fadeDiv.attr('role', 'dialog');
	fadeDiv.attr('aria-labelledby', 'myModalLabel');
	fadeDiv.attr('aria-hidden', 'true');
	
	title.attr('id', 'modal-title');
	
	
	// Add classes to ALL the divs
	dialogDiv.attr('class', 'modal-dialog');
	contentDiv.attr('class', 'modal-content');
	headDiv.attr('class', 'modal-header');
	bodyDiv.attr('class', 'modal-body');
	footDiv.attr('class', 'modal-footer');
	buttonDiv.attr('class', 'btn-group');
	
	// Set up the buttons
	cButton.attr('class', 'close');
	cButton.attr('type', 'button');
	cButton.attr('data-dismiss', 'modal');
	cButton.attr('aria-hidden', 'true');
	cButton.html('&times;');
	
	dButton.attr('class', 'btn btn-default');
	dButton.attr('type', 'button');
	dButton.attr('data-dismiss', 'modal');
	dButton.html('Cancel');
	
	pButton.attr('class', 'btn btn-primary');
	pButton.attr('type', 'button');
	pButton.attr('method', 'confirm');
	pButton.attr('id', 'confirm');
	pButton.attr('data-loading-text', 'Creating Activity...');
	pButton.html('Confirm');
	
	// Append all the divs and buttons to thier correct parent
	$('body').append(fadeDiv);
	fadeDiv.append(dialogDiv);
	dialogDiv.append(contentDiv);
	contentDiv.append(headDiv);
	contentDiv.append(bodyDiv);
	contentDiv.append(footDiv);
	headDiv.append(cButton);
	headDiv.append(title);
	footDiv.append(buttonDiv);
	buttonDiv.append(dButton);
	buttonDiv.append(pButton);

}
	