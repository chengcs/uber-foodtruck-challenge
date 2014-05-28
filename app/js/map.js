$(function() {
	// URLs
	var GEO_DATA_URL = "http://54.187.124.79/getfoodtrucks.php";
	var SEARCH_URL = "http://54.187.124.79/search.php?prefix=";

	// JSON elements
	var FT_NAME_ID = 'applicant';
	var FT_ADDRESS_ID = 'address';
	var FT_DESC_ID = 'fooditems';
	var FT_LAT_ID = 'latitude';
	var FT_LNG_ID = 'longitude';

	// HTML elements
	var MAP_DIV_ID = 'map_canvas';
	var SEARCHBAR_ID = 'search';
	var SEARCH_DIV_ID = 'livesearch';

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

	// Search for a specific food truck 
	var searchbar = document.getElementById(SEARCHBAR_ID);
	searchbar.addEventListener("keyup", function() {
		showSearchResult(searchbar.value, SEARCH_DIV_ID);
	});

	// Google Maps scrolling issue
	var divfix = '<div class="marker" style="line-height:1.35;overflow:hidden;white-space:nowrap;">';

	var centerPosition = new google.maps.Marker({
		position : map.getCenter(),
		map : map,
		icon : {url: 'images/pin.png', scaledSize: new google.maps.Size(17, 45)}
	});

	// Initialize Marker Information Window
	var markerWindow = new google.maps.InfoWindow({
		content : "",
		position : latlng
	});

	// Update nearest food trucks when center of map changes
	google.maps.event.addListener(map, 'mouseup', function() {
		var center = map.getCenter();
		//infoWind.setContent(divfix+center.toUrlValue()+'</div>');
		centerPosition.setPosition(center);
		latlng = center;

		// Initialize food trucks
		var fts = new Foodtrucks({
			model: Foodtruck
		});

		var ft_mapper = new Map({
			collection: fts
		});
		fts.fetch();
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

	var markerArray = []; // keep track of markers
	var image = 'images/foodtruck.png'; // food truck icon
    
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
						icon: {url: image, scaledSize: new google.maps.Size(39,20)},
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

// -- Search for Food Trucks --

	var searchPrefix = ""; // for URL parameter

	var SearchFTModel = Backbone.Model;

	var SearchFTCollection = Backbone.Collection.extend({
		model: SearchFTModel,
		url: function() {
			return SEARCH_URL+searchPrefix;
		},
		initialize: function() {
		}
	}); // End of SearchFT collection

	var SearchFTView = Backbone.View.extend({
		el: $('#'+SEARCH_DIV_ID),
		initialize: function() {
			this.listenTo(this.collection, 'reset', this.render);
		},

		render: function() {
			_.each(this.collection.models, function(ft) {
				var searches = document.getElementById(SEARCH_DIV_ID); 
				searches.innerHTML += "<p>"+ft.get(FT_NAME_ID)+"  "+ft.get(FT_ADDRESS_ID)+"</p>"; 
			}); 
		} 
	}); // End of SearchView view 

// -- Helper functions --

	// Get and format Marker Information Window
	// Parameters: ftname: name of food truck, ftaddress: address of food truck,
	// ftfood: food available at food truck
	function markerContent(ftname, ftaddress, ftfood) {
		var content = divfix+
			'<h2 style="font-size:1.5em">'+ftname+'</h2>'+
			'<p>'+ftaddress+'</p>'+
			'<p><b>'+ftfood.replace(/:/g, '</p><p>')+'</b></p>'+
			'</div>';
		return content;
	}	

	// Finds search results for search bar
	// Parameters: prefix: search query, divid: HTML element to show results
	function showSearchResult(prefix, divid) {
		document.getElementById(divid).innerHTML = "";
		searchPrefix = prefix;
		
		if (prefix === "") { // hide HTML element style if search bar is empty
			document.getElementById(divid).style.padding="0em";
		} else {
			document.getElementById(divid).style.padding=".5em";

			// Initialize Search Results
			var searchResultFTs = new SearchFTCollection({
				model: SearchFTModel
			});
			var ft_search = new SearchFTView({
				collection: searchResultFTs
			});
			searchResultFTs.fetch();
		}
	}

	// Returns the query string for GET request for getting closest food trucks
	// Parameters: lon: longitude coordinate, lat: latitude coordinate
	function getUrlCoordsParam(lon, lat) {
		return "?lng="+lon+"&lat="+lat;
	}
});
