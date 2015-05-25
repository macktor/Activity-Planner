for (var i=0;i<model.parkedActivities.length; i++){
			var activity = model.parkedActivities[i];
			addActivity($('#activityTable'), activity.getTypeId(), activity.getDescription(), activity.getLength());
		}
		var c = {};
		//$("#day").draggable();
	
		//Gör följande till en egen funktion?

		//Drag&drop

		$('.activites tr').draggable({
		    helper: "clone",
		    start: function(event, ui) {
			c.tr = this;
			c.helper = ui.helper;
			}
		});
		$('.day').droppable({
		drop: function(event, ui) {
			var text = ui.draggable.text().split("Min");
			var length = $.trim(text[0]);
			var desc = $.trim(text[1]);
			addActivity($('#dayTable'), $.trim(ui.draggable.attr('id')), desc, length); //recreates the activites in the day table
		    $(c.tr).remove();
		    $(c.helper).remove();
		}


	    });
