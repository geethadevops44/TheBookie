/*steal.plugins(	
		'controllers',			// a widget factory
		'models'	// subscribe to OpenAjax.hub

		)				

		.models("roomFacility","roomType","guest","extra", "room", "facility")						// loads files in models folder 

		.controllers(
				 "guest",
				 "booking",
			 	 "season",
				 "main",
		 		"calendar",
		 		"extra",
		 		"upload",
		 		"tree",
		 		"room",
		 		"facility",
		 		"online");					// loads files in controllers folder
*/

steal("models/roomFacility.js","models/roomType.js","models/guest.js","models/extra.js", "models/room.js", "models/facility.js").
		then( "controllers/main_controller.js").then(
		 "controllers/guest_controller.js",
		 "controllers/season_controller.js",
 		"controllers/calendar_controller.js",
 		"controllers/extra_controller.js",
 		"controllers/upload_controller.js",
 		"controllers/tree_controller.js",
 		"controllers/room_controller.js",
 		"controllers/facility_controller.js",
 		"controllers/online_controller.js").then(
 		"controllers/booking_controller.js"

);					// loads files in models folder 
/*
		.controllers(
				 "guest",
				 "booking",
			 	 "season",
				 "main",
		 		"calendar",
		 		"extra",
		 		"upload",
		 		"tree",
		 		"room",
		 		"facility",
		 		"online");	*/				// loads files in controllers folder