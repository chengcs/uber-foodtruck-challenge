$(function() {
	// URLs
	var GEO_DATA_URL = "http://54.187.124.79/getfoodtrucks.php";

	// JSON elements
	var FT_NAME_ID = 'applicant';
	var FT_ADDRESS_ID = 'address';
	var FT_DESC_ID = 'fooditems';
	var FT_LAT_ID = 'latitude';
	var FT_LNG_ID = 'longitude';

	// HTML elements
	var MAP_DIV_ID = 'map_canvas';
	
	var geocoder = new google.maps.Geocoder();

	// Roughly the center of San Francisco
	var latlng = new google.maps.LatLng(37.7833, -122.4167);
    
	// Google Maps Options
	var myOptions = {
		zoom: 15,
		center: latlng,
		mapTypeId: 'roadmap'
	}
    
	// Add the Google Map to the page
	var map = new google.maps.Map(document.getElementById(MAP_DIV_ID), myOptions);

	// Center map based on user's location
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
		curLat = position.coords.latitude;
		curLong = position.coords.longitude;
		initialLocation = new google.maps.LatLng(curLat, curLong);
		//map.setCenter(initialLocation);
		});
	}
});

	var Foodtruck = Backbone.Model;
	var Foodtrucks = Backbone.Collection.extend({
		model: Foodtruck,
		url: function() {
			console.log(GEO_DATA_URL+getUrlCoordsParam(latlng.lng(), latlng.lat()));
			return GEO_DATA_URL+getUrlCoordsParam(latlng.lng(), latlng.lat());
		},
		initialize: function() {
		}
	});
	
		var Map = Backbone.View.extend({
		el: $('#'+MAP_DIV_ID),
		initialize: function() {
			
			// Force the height of the map to fit the window
			this.$el.height($(window).height() - $("header").height());	
			
			this.listenTo(this.collection, 'reset', this.render);
		},

		render: function() {
			var iter = 0;
			var mark;
			_.each(this.collection.models, function(ft) {
				var pos = new google.maps.LatLng(ft.get(FT_LAT_ID), ft.get(FT_LNG_ID));
				if (markerArray.length < 10) {
					mark = new google.maps.Marker({                         
						position: pos,
						map: map,
						title: ft.get(FT_NAME_ID),                  
						description: ft.get(FT_DESC_ID)
					});
					markerArray.push(mark);
				} else {
					mark = markerArray[iter];
					markerArray[iter].setPosition(pos);
					iter += 1;
				}
				google.maps.event.addListener(mark, 'click', function() {
					markerWindow.setContent(markerContent(ft.get(FT_NAME_ID), ft.get(FT_ADDRESS_ID), ft.get(FT_DESC_ID)));
					markerWindow.setPosition(mark.getPosition());
					markerWindow.open(map, this);
				});
			});
		}
	}); //-- End of Map view 

	// Initialize Food Trucks
	var foodtrucks = new Foodtrucks({
		model: Foodtruck
	});

	var ft_map = new Map({
		collection: foodtrucks
	});
	foodtrucks.fetch();
	
	// Returns the query string for GET request for getting closest food trucks
	// Parameters: lon: longitude coordinate, lat: latitude coordinate
	function getUrlCoordsParam(lon, lat) {
		return "?lng="+lon+"&lat="+lat;
	}
});