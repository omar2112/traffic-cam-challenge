"use strict";

$(document).ready(function() {
	var mapElem = document.getElementById('map');
	var searchbox = $('#search');

	function createMap(elem, center, zoom) {
		var map = new google.maps.Map(elem, {
			center: center, 
			zoom: zoom,
		});
	}

	var center = {
		lat: 47.6,
		lng: -122.3
	};

	var map = new google.maps.Map(mapElem, {
		center: center,
		zoom: 12
	});

	var infoWindow = new google.maps.InfoWindow();
	infoWindow.setContent("<h2>Here I am!</h2><p>Don't you wish you were here.</p>");

	var focuspoints;
	var markers = [];

	$.getJSON('http://data.seattle.gov/resource/65fc-btcc.json') 
		.done(function(data) {
			focuspoints = data;

			//create a new marker with the corresponding position
			data.forEach(function(focuspoint) {
				var marker = new google.maps.Marker({
					position: {
						lat: Number(focuspoint.location.latitude),
						lng: Number(focuspoint.location.longitude)
					},
					map: map
				});
				markers.push(marker);

				//assings the infowindow according to the current marker's picture and name.
				google.maps.event.addListener(marker, 'click', function() {
					map.panTo(this.getPosition());
					var html = '<h2>' + focuspoint.cameralabel + '</h2>';
					html+= '<p><img src=' + focuspoint.imageurl.url + '></p>';
					infoWindow.setContent(html);
					infoWindow.open(map, this);
				});
			})

		})
		.fail(function(error) {
			alert('traffic data failed to load! ' + error);
		})
		.always(function() {

		});

		//only markers that contain the search phrase will appear. 
		searchbox.bind('search keyup', function() {
			for (var i = 0; i < focuspoints.length; i++) {
				var tempString = focuspoints[i].cameralabel.toLowerCase();
				var compareString = this.value.toLowerCase();
				if (tempString.indexOf(compareString) == -1) {
					markers[i].setMap(null);
				} else {
					markers[i].setMap(map);
				}
			}
		});

});
