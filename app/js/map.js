$(function() {
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