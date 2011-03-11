$(document).ready(function() {

	$(".yform").validate();  
	overlay	= $('<div id="fancybox-overlay"></div>'),
	
		//---  PLANNER SECTION CODE   
		// change rate for room
	 $.fn.changeRate = function (amount, first, second) {
		 var currency = "&euro";
		 var to_replace ="Per ";
		 var result = false;
		 if( typeof amount !== "undefined" && typeof first !== "undefined" && typeof second !== "undefined")
			 {
			 
			 var infos = $(this).children("span");
		 if(infos  && typeof infos === "object"  && infos.length)
			 {
			 
			 try {
				infos.eq(0).html(amount + ' ' + currency);
				 infos.eq(1).html(' / ' + first.replace(to_replace, ""));
				 infos.eq(2).html(' / ' + second.replace(to_replace, "")); 
				 result = true;
			 }
			 
			 catch(e)
			 {
				result = false; 
				 
			 }		 		

			 }	
		 
			 }
		 
		 return result;
		 
	 };
	 
	 //make a new div overlay element
	 $('body').append($('<div class="ui-widget-overlay"></div>'));
	 $.jGrowl.defaults.position = 'center'; 
	 
	 //notifier for all jsp
	 $.fn.notify = function(title, description, redirect){
		 //get height of the body to cover all html page
		 var heightbody = $('body').height();
			if (!$(".ui-widget-overlay").is(':visible')) {
				
				$(".ui-widget-overlay").css("height", heightbody).show();
				
			}
			
		
		 $.jGrowl(description, {
			    beforeClose: function(e,m) {
			    	
			        if(redirect)
			        	{
			        		window.location.href = redirect;
			        	}
			        	
			    },
			    animateOpen: {
			        height: 'show'
			    },
			    position: "center",
			    header: title,
			    close : function (){
			    	
			    	$(".ui-widget-overlay").hide();
			    }

			});

	 };
	 

		 $(".yform.json").submit(function(event){
		  		
		 		//setting for input form fields
		   		var formInput=$(this).serialize();
		   		var hrefAction = $(this).attr("action");
		   		var _redirectAction = $(this).find('input:hidden[name="redirect_form"]').val();
		   		 _redirectAction =(_redirectAction == null) ? "home.action" : _redirectAction;
		   		//if form is valid
		   		if ($(this).valid())
		   			{
		   			
		   		$.ajax({
		   		   type: "POST",
		   		   url: hrefAction,
		   		   data: formInput,
		   		   success: function(data_action){
		   			   
		   			var title_notification = null;
		   			
		   			   if (data_action.result == "success")
		   				   {
		   			
		   				$().notify("Congratulazioni", data_action.description, _redirectAction);
		   				    				    
		   				   }
		   		    
		   		     else
		   		    	 {
		   		    	 	$().notify("Attenzione", data_action.description);
		   		    	 }
		   		    	
		   		   },
		   		   
		   		   error: function (){
		   			   
		   			$().notify("Errore Grave", "Problema nella risorsa interrogata nel server");
		   		   }

		   		
		   		 });
		   		
		   	  }
		   		
		   		return false;
		   	  
		   	  });

	 
	
  	$(".btn_check_in").button({
  		icons: {
            primary: "ui-icon-check"
        }
  	});
  	
  		/* extras adding */
  	   $('input[name="extras_array[]"]').click(function(){
  		   var amount_target_dom = $("#extras_room");
  		   var amount = 0;
  		   $('input:checked[name="extras_array[]"]').each (function(key, value){
  			   
  			  amount += isNaN(parseInt($(value).val())) ? 0 : parseInt($(value).val());
  			   
  		   });
  		   
  		 amount_target_dom.text(amount);
		   //update subtotal
		   updateSubtotal();
  		 
  		   
  		   
  		   
  	   });
  	   
  	   /* room price changing*/
  	   $('input[name="per_value"]').keyup( function(){
  		  
  		  //typeof o === 'number' && isFinite(o); 
  		   if($(this).valid()){
  			   
  			   $("#price_room").html( $(this).val());
  			   //update subtotal
  			   updateSubtotal();
  		   }
  		   
  		   
  	   });
  	   
  	  /* update subtotal */
  	   var updateSubtotal = function(){
  		   var subtotal = 0;
  		   var payments = ["#price_room",  "#extras_room", "input[name=\"extra_value_adjustment[]\"]", ];
  		   
  		   try {
  		   $.each(payments, function (key, value){
  			 if(! $.isArray($(value)))
  				 {
  				 
  				 var value_contained =$(value).is('input') ? $(value).val() : $(value).text();
  				 subtotal += isNaN(parseInt (value_contained)) ? 0: parseInt (value_contained);
  				 } //else if an array of doms was selected by selector
  			 else
  				 {
  				 $(value).each(function(k , v){
  					var value_contained =$(v).is('input') ? $(v).val() : $(v).text(); 
  					subtotal += parseInt (value_contained); 
  				 });
  				 
  				 }
  			 

  			 
  		   });
  		       		   // now update permanently subtotal
    		   $(".subtotal_room").text(subtotal);
  		   }
  		   catch( e )
  		   {
  			   //nothing for now -- problema nei selettori
  		   }
  		   

 
  	   };
  	   
  	   
	   /* adjustment and payments*/
	   
	   $('input[name="extra_value_adjustment[]"], input[name="pay_value_adjustment[]"]').keyup(function() {
		   var current_parent=$(this).parents(".type-text");
		   /* prepare selector string for class whit whitespaces */
		   var current_class_selector = $(this).attr("class").replace( new RegExp(" ","g"), ".");
		   /* check if current was cloned */
		   var next_sibling = current_parent.next().find("." + current_class_selector);
		   if( next_sibling  && ! next_sibling.size() > 0 )
			   {
				   var copy_parent = current_parent.clone(true);
		   copy_parent.find(".green").remove();
		   copy_parent.find("input").val("");
		   //copy_parent.find($(this)).bind('keyup',cloneEvent);
		   copy_parent.insertAfter(current_parent);	   
			   
			   }

		   /* adjust subtotal ... */
		   var new_subtotal = null;
		   if(current_class_selector.indexOf("extra_value_adjustment") >= 0)
		   { 
			   new_subtotal = parseInt($("#subtotal_room").val()); 
		   	 	new_balance = parseInt($("#balance_room").val()); 	
		      /* code for calcute new subtotal */
			  $("." + current_class_selector).each( function(key, value) {
				   
				  if( $(value).valid() )
				   {
			   new_subtotal = new_subtotal + parseInt ( $(value).val() );
				   }
		  		   });

			  // show new subtotal value
		      //-- $(".subtotal_room").html(new_subtotal);
			  updateSubtotal();
		     
		   /* end code for subtotal calculation */
		   }
		   else
		   { new_subtotal = parseInt($("#balance_room").val()); 
		      /* code for calcute new subtotal */
			  $("." + current_class_selector).each( function(key, value) {
				   
				  if( $(value).valid() )
				   {
			   new_subtotal = new_subtotal - parseInt ( $(value).val() );
				   }
		  		   });   
		     $(".balance_room").html(new_subtotal);
		   /* end code for subtotal calculation */
		   
		   
		   }
		  
		   
		   
		  //--- $(this).unbind('keyup');
		   
		 });
	   

		
   var $calendar = $('#calendar');
   var id = 10;
   /* setting rooms_list array */
   var list_rooms=new Array(1, 4, 23, 35,36,37,38,39,40,41,42,43,44,45,49,52,53,54,55);
   /* setting number of rooms */
	var num_rooms=list_rooms.length;
	
   if($calendar.length > 0)
	   	   {
	   
	   
		$(".type_rooms").hide();
		$("#change_rate").toggle(function(){
		$(".type_rooms").show();
		$(this).html("done");
		},function(){
		$(".type_rooms").hide();
		
		_first = $('input:radio[name="per_room_person"]:checked');
		 _first = (_first.val() !== "")? _first.siblings("label").html() : "error";
		_second = $('input:radio[name="per_night_week"]:checked');
		_second = (_second.val() !== "")? _second.siblings("label").html() : "error";
		_amount = $('input[name="per_value"]');
		_amount = (_amount.val() !== "")? _amount.val() : "error";
		
		if($("#rate").changeRate(_amount, _first, _second) !== false);
		$(this).html("change rate for this booking");
		});
	   
		  
	   
	   
	   
   $calendar.weekCalendar({
      timeslotsPerHour : 1,
      use24Hour: true,
       newEventText : "Room",
      timeslotHeight: 30,
      defaultEventLength: 1 ,
      allowCalEventOverlap : false,
      overlapEventsSeparate: false,
      firstDayOfWeek : 1,
       businessHours :{start: 0, end: num_rooms, limitDisplay: true },
      daysToShow :10,
      //added by Alberto
      listRooms: list_rooms,
      buttonText:{today : "today", lastWeek : "Prev", nextWeek : "Next"},
      height : function($calendar) {
         return $(window).height() - $("h1").outerHeight() - 1;
      },
      eventRender : function(calEvent, $event) {
         if (calEvent.end.getTime() < new Date().getTime()) {
            $event.css("backgroundColor", "#aaa");
            $event.find(".wc-time").css({
               "backgroundColor" : "#999",
               "border" : "1px solid #888"
            });
         }
      },
      draggable : function(calEvent, $event) {
         return calEvent.readOnly != true;
      },
      resizable : function(calEvent, $event) {
         return calEvent.readOnly != true;
      },
      //metodo per la creazione di una nuova casella
      eventNew : function(calEvent, $event) {
         var $dialogContent = $("#event_edit_container");
         resetForm($dialogContent);
         $dialogContent.find("#date_booking").html(calEvent.start + ' - ' + calEvent.end);
         var duration = days_between(new Date(calEvent.end), new Date(calEvent.start)) + 1;
         var remainings = days_between_signed(new Date(calEvent.start), new Date());
         
         if (remainings < -1)
        	 {
        	 $(".btn_check_in").button("disable");
        	 }
         $dialogContent.find("#duration").html(' ( ' + duration + ' days )');
         var startField = calEvent.start;
         var endField = calEvent.end;
         var id_booked = calEvent.id_booked;
         var room_name =  getRoomNameById(id_booked);
         $dialogContent.find('#room_name_dialog').text(room_name);
         var titleField = $dialogContent.find("input[name='fullname']");
         var bodyField = $dialogContent.find("textarea[name='body']");
         var confirmField = $dialogContent.find("select[name='confirm']");
         getCustomers("input[name='fullname']");
         
         
         
         
         
         $dialogContent.dialog({
            modal: true,
            width:650,
            hide: "explode",
            show:"blind",
            title: "New Booking for room: " + room_name,
            close: function() {
               $dialogContent.dialog("destroy");
               $dialogContent.hide();
              $('#calendar').weekCalendar("removeUnsavedEvents");
            },
            buttons: {
               save : function() {
                if ($(".yform").valid())
              	 {
            	   calEvent.id = id_booked;
                  id++;
                  calEvent.start = new Date(startField);
                  calEvent.end = new Date(endField);
                  calEvent.title = titleField.val();
                  calEvent.body = bodyField.val();
                  calEvent.confirm = confirmField.val();

                  //--$calendar.weekCalendar("removeUnsavedEvents");
                 $calendar.weekCalendar("updateBookEvent", calEvent);
                	 $dialogContent.dialog("close");
                	 }
                  
               },
               cancel : function() {
            	 
                  $dialogContent.dialog("close");
                  
               }
            }
         }).show();

         $dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
         setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));

      },
      eventDrop : function(calEvent, $event) {
        
      },
      eventResize : function(calEvent, $event) {
      },
      //metodo che viene richiamato quando clicco su una casella
      eventClick : function(calEvent, $event) {

         if (calEvent.readOnly) {
            return;
         }

         var $dialogContent = $("#event_edit_container");
         resetForm($dialogContent);
         //calEvent è un tipo di dato data, che è un oggetto con degli attributi start end e title
         //per cui, se clicco in una casella che ha già un data calEvent, allora setterò con 
         //questi valori i campi di testo nella finestra di dialogo.
         
         $dialogContent.find("#date_booking").html(calEvent.start + ' - ' + calEvent.end);
         var startField = calEvent.start;
         var endField = calEvent.end;
         var id_booked = calEvent.id_booked;
         var room_name =  getRoomNameById(id_booked);
         $dialogContent.find('#room_name_dialog').text(room_name);
         var titleField = $dialogContent.find("input[name='fullname']");
         var bodyField = $dialogContent.find("textarea[name='body']");
         bodyField.val(calEvent.body);

         $dialogContent.dialog({
            modal: true,
            width: 650,
            title: "Modify Booking - " + room_name,
            close: function() {
               $dialogContent.dialog("destroy");
               $dialogContent.hide();
               $('#calendar').weekCalendar("removeUnsavedEvents");
            },
            buttons: {
               save : function() {
            	  calEvent.id =id_booked;
                  calEvent.start = new Date(startField.val());
                  calEvent.end = new Date(endField.val());
                  calEvent.title = titleField.val();
                  calEvent.body = bodyField.val();

                  $calendar.weekCalendar("updateBookEvent", calEvent);
                  $dialogContent.dialog("close");
               },
               "delete" : function() {
                  $calendar.weekCalendar("removeEvent", calEvent.id);
                  $dialogContent.dialog("close");
               },
               cancel : function() {
                  $dialogContent.dialog("close");
               }
            }
         }).show();

         var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
         var endField = $dialogContent.find("select[name='end']").val(calEvent.end);
         $dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
         setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));
         $(window).resize().resize(); //fixes a bug in modal overlay size ??

      },
      eventMouseover : function(calEvent, $event) {
      },
      eventMouseout : function(calEvent, $event) {
      },
      noEvents : function() {

      },
      data : function(start, end, callback) {
         callback(getEventData());
      }
   });

   
	 }
   
   // END WEEKCALENDAR FUNCTION
   
   
   
   function resetForm($dialogContent) {
      $dialogContent.find("input:text").val("");
      $dialogContent.find("textarea").val("");
   }
   
   
   function days_between(date1, date2) {

	    // The number of milliseconds in one day
	    var ONE_DAY = 1000 * 60 * 60 * 24;

	    // Convert both dates to milliseconds
	    var date1_ms = date1.getTime();
	    var date2_ms = date2.getTime();

	    // Calculate the difference in milliseconds
	    var difference_ms = Math.abs(date1_ms - date2_ms);
	    
	    // Convert back to days and return
	    return Math.round(difference_ms/ONE_DAY);

	}
   
   
   function days_between_signed(date1, date2) {

	    // The number of milliseconds in one day
	    var ONE_DAY = 1000 * 60 * 60 * 24;

	    // Convert both dates to milliseconds
	    var date1_ms = date1.getTime();
	    var date2_ms = date2.getTime();

	    // Calculate the difference in milliseconds
	    var difference_ms = date1_ms - date2_ms;
	    
	    // Convert back to days and return
	    return Math.round(difference_ms/ONE_DAY);

	}
   
   
   function getCustomers(selector)
   {
		var cache = {},
		lastXhr;

	   $(selector).autocomplete({
			minLength: 2,
			source: function( request, response ) {
				var term = request.term;
				if ( term in cache ) {
					response( cache[ term ] );
					return;
				}

				lastXhr = $.getJSON( "customer.json", request, function( data, status, xhr ) {
					cache[ term ] = data.customers;
					if ( xhr === lastXhr ) {
						response( data.customers );
					}
				});
			}
		});


	   
   }
   

   function getRoomNameById(id)
   {
	    var input_room_id = $('input[name="id_room"]').filter(function(){
		 return ($(this).val() == id);
	    	});
	   var name  = $(input_room_id).siblings();
	   if(name.text() != undefined)
		   return name.text();
	   else
		   return '******';
	
   }
   
   
   function getEventData() {
      var year = new Date().getFullYear();
      var month = new Date().getMonth();
      var day = new Date().getDate();

      return {
         events : [
            {
               "id":1,
               "start": new Date(year, month, day, 12),
               "end": new Date(year, month, day, 13, 30),
               "title":"Giovanni Stara"
            },
            {
               "id":2,
               "start": new Date(year, month, day, 14),
               "end": new Date(year, month, day, 14, 45),
               "title":"Marc Devois"
            },
            {
               "id":3,
               "start": new Date(year, month, day + 1, 17),
               "end": new Date(year, month, day + 1, 17, 45),
               "title":"Laura Saint"
            },
            {
               "id":4,
               "start": new Date(year, month, day - 1, 8),
               "end": new Date(year, month, day - 1, 9, 30),
               "title":"George Mason"
            },
            {
               "id":5,
               "start": new Date(year, month, day + 1, 14),
               "end": new Date(year, month, day + 1, 15),
               "title":"Michele Gors"
            },
            {
               "id":6,
               "start": new Date(year, month, day, 10),
               "end": new Date(year, month, day, 11),
               "title":"Katia Solari",
               readOnly : true
            }

         ]
      };
   }


   /*
    * Sets up the start and end time fields in the calendar event
    * form for editing based on the calendar event being edited
    */
   function setupStartAndEndTimeFields($startTimeField, $endTimeField, calEvent, timeslotTimes) {

      for (var i = 0; i < timeslotTimes.length; i++) {
         var startTime = timeslotTimes[i].start;
         var endTime = timeslotTimes[i].end;
         var startSelected = "";
         if (startTime.getTime() === calEvent.start.getTime()) {
            startSelected = "selected=\"selected\"";
         }
         var endSelected = "";
         if (endTime.getTime() === calEvent.end.getTime()) {
            endSelected = "selected=\"selected\"";
         }
         $startTimeField.append("<option value=\"" + startTime + "\" " + startSelected + ">" + timeslotTimes[i].startFormatted + "</option>");
         $endTimeField.append("<option value=\"" + endTime + "\" " + endSelected + ">" + timeslotTimes[i].endFormatted + "</option>");

      }
      $endTimeOptions = $endTimeField.find("option");
      $startTimeField.trigger("change");
   }

   var $endTimeField = $("select[name='end']");
   var $endTimeOptions = $endTimeField.find("option");

   
   //reduces the end time options to be only after the start time options.
   $("select[name='start']").change(function() {
      var startTime = $(this).find(":selected").val();
      var currentEndTime = $endTimeField.find("option:selected").val();
      $endTimeField.html(
            $endTimeOptions.filter(function() {
               return startTime < $(this).val();
            })
            );

      var endTimeSelected = false;
      $endTimeField.find("option").each(function() {
         if ($(this).val() === currentEndTime) {
            $(this).attr("selected", "selected");
            endTimeSelected = true;
            return false;
         }
      });

      if (!endTimeSelected) {
         //automatically select an end date 2 slots away.
         $endTimeField.find("option:eq(1)").attr("selected", "selected");
      }

   });


   var $about = $("#about");

 
   	//---  END PLANNER SECTION CODE   
   
   
   //---  LOGIN SECTION CODE   
   		
   		$(".btn_submit").button();
   		
   //---  END LOGIN SECTION CODE   
   
   
   //---  ADD ROOMS SECTION CODE   
   
   	  $(".btn_save").button({
   	      icons: {
   	          primary: "ui-icon-check"
   	      }});
   	 
   	  //select room types
   	$("#roomtype_id").autocomplete({
		minLength: 2,
		source: function( request, response ) {
			var term = request.term;

			lastXhr = $.getJSON( "findAllRoomTypes.action", request, function( data, status, xhr ) {
					response( data);

			});
		}
	});

   	  
   	  //submit management for add room form
   	//--  $(".btn_add_room").submitForm("findAllRooms.action?section=accomodation", null);
   	  
   	  //add notify functionality as tooltip for input text
	  $("#room_name_id, #roomtype_id, #max_guests_id, #price_room_id").mousedown(function(){
		  $.jGrowl("close");
		  $.jGrowl($(this).nextAll("span:hidden").text(), { position: "top-left" });
 
	  }).mouseout(function(){
		 
		  $.jGrowl("close");
	  });
	  
 
	//button for add room cancel  
	  $(".btn_cancel_room").click(function(event){
		  event.preventDefault();
		  var validator = $(this).parents(".yform.json").validate();
		  validator.resetForm();

	  });
	  
	  $("#uploadFacility").validate();
	  //facility form upload
	  $('#uploadFacility').ajaxForm({ 
          beforeSubmit: function(formData, jqForm, options){
        	  
        	  $(".upload_loader").show();
          },
          success: function(responseText, statusText){
        	  
        	  $("#result_facility_upload").text(responseText);
        	  $(".upload_loader").hide();
        	  
          },
          error: function(){
          $(".upload_loader").hide();
          $.jGrowl("Errore");
          
          } ,
          dataType: "json"
      }); 
	  
   	 
	  
	  
	  
	  
   	 $(".btn_delete").button({
   	     icons: {
   	         primary: "ui-icon-trash"
   	     }});
   	 
   	 /* describe editing handler */
   	 $(".describe_edit").toggle(function(){
   		
   		 $(this).siblings(":input").removeClass("describe").attr('readonly', false) ;
   		 
   	 }, function(){

   		 $(this).siblings(":input").addClass("describe").attr('readonly', true) ; 
   		 
   	 });
   	 /* hide number of rooms  for default... */
   	 $(".num_of_rooms").hide();
   	 
   	 $('input[name="several_rooms"]').click(function(){
   	   if($(this).is(":checked") ) {
   	  $(".num_of_rooms").show();
   	 $(this).attr("checked", "checked");
   	 }
   	 else
   	 {
   	  $(".num_of_rooms").hide();
   	 $(this).removeAttr('checked');

   	 }
   	 });
   	 

   	 

   	 
   	 $('input[name="room_name"]').focus(function(){
   		 var edited_class="edited_room_name";
   		  
   		if(!$(this).hasClass(edited_class))
   			{
   			 $(this).val("");
   			 $(this).addClass(edited_class);
   			 $(this).effect("highlight", {}, 3000);

   			}
   		 $(this).effect("pulsate", { times:3 },1000);

   		 });
   		
   		
   		
   //---  END ADD ROOMS SECTION CODE  
   
   
   //---  SEASONS SECTION CODE   
   
   		
		   	 $(".btn_season").button({
			     icons: {
			         primary: "ui-icon-circle-plus"
			     }});
			 $(".btn_save_all").button({
			     icons: {
			         primary: "ui-icon-check"
			     }});
			 
		  $("#rename_season").toggle(function(){
			  $('input[name="season_name"]').focus().css("border","1px solid").removeAttr("readonly");
		  }, 
		  function(){
			  $('input[name="season_name"]').css("border","none").attr("readonly","true");
		
		  });
		  
		  
		 /* Hide/Show season name change */
		 
		 $(".btn_season").toggle( function(){
			 
			 $("#chng_season_name").show();
		 }, function(){
			 
			 $("#chng_season_name").hide();
			 
		 });
		 
		
		 $("#add_period").click( function(){
			 var dd=  $(".subcolumns").eq(0);
		
			 var added= $("#to_add_period").clone().insertAfter(dd).removeAttr("id").show();
				added.find(".erase_period").click( function(){
					 
					$(this).closest(".subcolumns").remove();
		
				 });
		 });
		 
		 $(".erase_period").click( function(){
			 
			$(this).closest(".subcolumns").remove();
		
		 });
   //---  END SEASONS SECTION CODE  
   
   
   //---  GUESTS SECTION CODE   
   
		 
		  $(".btn_g_search").button({
		      icons: {
		          secondary: "ui-icon-arrowreturnthick-1-e"
		      }});
		
	  $(".btn_add_guest").button({
	      icons: {
	          primary: "ui-icon-circle-plus"
	      }}).click(function(){
	    	window.location.href="guest_new.jsp?sect=guests"; 
	    	return false;
	      });
	  
	  
	  $(".btn_save_guest").button({
	      icons: {
	          primary: "ui-icon-circle-plus"
	      }});
	  
	  $(".btn_edit_guest").button({
	      icons: {
	          primary: "ui-icon-check"
	      }});
	  
	  
   //---  END GUESTS SECTION CODE  
   
   
   //---  EXTRAS SECTION CODE   
   
		var values = []; 
		$("#extraForm").validate();
		$(".btn_addExtra").show();
	  	$(".btn_addExtra").button({
	  		icons: {
	            primary: "ui-icon-circle-plus"
	        }
	  	});
		
	  	$(".btn_saveExtra").button({
	  		icons: {
	            primary: "ui-icon-check"
	        }
	  	});
		
	  	$(".btn_cancel").button({
	  		icons: {
	            primary: "ui-icon-cancel"
	        }
	  	});
		
	    $(".btn_addExtra").click(function() {
	      $(this).hide();	
		  $("#extraForm").show();
	  	});
		
		$(".btn_saveExtra").click(function() {
		  $("#extraForm").hide();
		  values.push($("#extraFormName").val());
		  var added = $("#newExtra").clone().insertAfter("#newExtra").attr("id", function(){ //clono il div e appendo all'id un progressivo
		  	return this.id + "_" + values.length;
		  	});
		  added.find("input").attr("name", function(){ //appendo al name dei radio button un progressivo
		  	return this.name + "_" + values.length;
		  	});
		  added.find(".renameExtra").before('<span class="extraName">' + values[values.length-1] + '</span>'); //inserisco prima del link il nome dell'extra
		  added.find(".renameExtraForm").val(function(){ //assegno al value dell'input text il nome dell'extra
		  	return values[values.length-1];
		  	});
		  added.find(".deleteExtra").click(function(){
		    var extraName = added.find(".extraName").text();
		  /*var index = added.attr("id").substr((added.attr("id").lastIndexOf("_")+1)); memorizzo l'indice del div corrente - errato perch�� gli indici non si aggiornano man mano che elimino elementi */
			var index = values.indexOf(extraName); //memorizzo l'indice del div corrente usando il nome dell'extra
			values.splice(index,1); //elimino l'elemento corrispondente dall'array
			$(this).closest(".newExtra").remove(); //elimino il div al click del link "delete"
			});	
		  added.find(".renameExtra").click(function(){ //gestisco il rename facendo comparire il form relativo
		  	$(this).hide();
		    $(this).siblings(".extraName").hide();
			$(this).siblings(".renameExtraForm").show();
			$(this).siblings(".renameExtraForm").select();
		  });
		  added.find(".renameExtraForm").blur(function(){ //gestisco il blur per salvare la rinomina dell'extra
			  var extraName = added.find(".extraName").text();
			  var index = values.indexOf(extraName); //memorizzo l'indice del div corrente usando il nome dell'extra
			  var newName = added.find(".renameExtraForm").val(); //memorizzo il nome dell'extra modificato
			  values.splice(index,1, newName);
			  $(this).hide();
			  $(".renameExtra").show();
			  $(this).siblings(".extraName").text(newName);
			  $(".extraName").show();
			  $("#extraForm").valid();
			});
		  
		  
		  $(".btn_addExtra").show();
		  $("#extraList").show();
	    });
		
	    $(".btn_cancel").click(function() {	
	  	  $("#extraForm").hide();
	  	  $(".btn_addExtra").show();
	    })
	  
   		
   //---  END EXTRAS SECTION CODE  
   
   
   //---  DETAILS SECTION CODE   
   
	  
	  $('a[id*=toggle]').click(function(){
		    if ($(this).hasClass('active') === true) {
		      $('a').removeClass('active');
		      $('body').removeAttr('class');
		    } else {
		      $('a').removeClass('active');
		      $('body').removeAttr('class').addClass($(this).text());
		      $(this).addClass('active');
		    }     
		  });
		  $('a#formReset').click(function(){
		      $('a').removeClass('active');
		      $('body').removeAttr('class');
		      $(this).addClass('active');
		  });

		  $(".btn_reset").button({
		      icons: {
		          primary: "ui-icon-cancel"
		      }});
		  
		  
		 /* Hide/Show password change */
		 
		 $("#change_pwd").toggle( function(){
			 
			 $(".chng_pwd").show();
		 }, function(){
			 
			 $(".chng_pwd").hide();
			 
		 });
		 
   //---  END DETAILS SECTION CODE  
   
   
   //---  CUSTOMER SECTION CODE   
   
   //---  END CUSTOMER SECTION CODE  
   
   
   //---  BOOK SECTION CODE   
   
			$.ajaxSetup({beforeSend: function(xhr){
				  if (xhr.overrideMimeType)
				  {
				    xhr.overrideMimeType("application/json");
				  }
				}
				});

			$( "#datepicker" ).datepicker({
				showOn: "button",
				buttonImage: "images/calendar.gif",
				buttonImageOnly: true
			});
			
			var cache = {},lastXhr;
			   $('input[name="fullname"]').autocomplete({
					minLength: 2,
					source: function( request, response ) {
						var term = request.term;
						if ( term in cache ) {
							response( cache[ term ] );
							return;
						}

						lastXhr = $.getJSON( "customer.json", request, function( data, status, xhr ) {
							cache[ term ] = data.customers;
							if ( xhr === lastXhr ) {
								response( data.customers );
							}
						});
					}
				});
			   
			   
			   /* extras and pay adjustment */
			   
			   $('input[name="extra_value_adjustment"], input[name="pay_value_adjustment"]').keyup(function() {
				   var current_parent=$(this).parents(".type-text");
				   var copy_parent = current_parent.clone(true);
				   copy_parent.find(".green").remove();
				   copy_parent.find("input").val("");
				   //copy_parent.find($(this)).bind('keyup',cloneEvent);
				   copy_parent.insertAfter(current_parent);
				   $(this).unbind('keyup');
				   
				 });
				//--- $(".type_rooms").hide();
				$("#change_rate").toggle(function(){
				$(".type_rooms").show();	
				},function(){
				$(".type_rooms").hide();	
				});
				

		 
   //---  END BOOK SECTION CODE  
   
	  
	//---  EMAIL SECTION CODE   
	  /* Hide/Show usable parameters */
	  
	  $("#show_usable").toggle( function(){
	 	 
	 	 $(".list_usable").show();
	  }, function(){
	 	 
	 	 $(".list_usable").hide();
	 	 
	  });
	  
	  
	//---  END EMAIL SECTION CODE  
	  
	  
	//---  ACCOMODATION SECTION CODE    
	  
 	  //submit management for add room form
   //--	  $(".btn_update_room").click(function(){submitForm("findAllRooms.action?section=accomodation", null);});
   //--	  $(".btn_delete_room").click(function(){submitForm("findAllRooms.action?section=accomodation", "deleteRoom.action");});

	  $(".btn_delete_room").click(function(event){
		  //-- event.preventDefault();
		  $(this).parents(".yform").attr("action", "deleteRoom.action");
	  });
	  
	  //button click handler for delete all rooms
	  $(".btn_save_all_rooms").click(function(event){
		  var allRedirectInputs = $(".yform.json").find('input:hidden[name="redirect_form"]');
		  var redirectOld =  allRedirectInputs.last().val();
		  allRedirectInputs.val("");
	   	  $(".yform.json").submit();
	   	allRedirectInputs.val(redirectOld);
	   	  
		    
	  });
	  
	  
	  $(".min_stay").click(function(){
			 if($(this).hasClass("clickable"))
				 {
				 $(".price_show").addClass("clickable");
				 $(this).removeClass("clickable");
				 $(".price_type").hide();
				 }

		 });
		 
		 $(".price_show").click(function(){
		 if($(this).hasClass("clickable"))
		 {
		 $(".min_stay").addClass("clickable");
		 $(this).removeClass("clickable");
		 $(".price_type").show();
		 }
			 
		 });
		 
		  $(".btn_add_new").button({
		      icons: {
		          primary: "ui-icon-circle-plus"
		      }}).click(function(){
			    	window.location.href="goAddNewRoom.action?sect=accomodation"; 
			    	return false;
			      });
		 
		//---  END ACCOMODATION SECTION CODE   
   
});