

function directions(start)
{		
	mapboxgl.accessToken = 'pk.eyJ1IjoibGVlbWFjayIsImEiOiJja3BtMTR2OHkxeHYzMm5vOXZuZmJsZzkzIn0.U-nXYuDL7Vr6JfMtrYHTjA';
	document.getElementById("instructions").style.display = "block";
	var mapPet = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v10',
	center: start, // starting position
	zoom: 12
	});
	alert ("boooo yaaaa");
	// initialize the map canvas to interact with later
	var canvas = map.getCanvasContainer();

	// an arbitrary start will always be the same
	// only the end or destination will change
	//var start = [-104.988,39.739];
	var end = ([-104.826,38.852]);
	getRoute();

	// create a function to make a directions request
	function getRoute() {
		// make a directions request using cycling profile
		// an arbitrary start will always be the same
		// only the end or destination will change
		var start = [-104.988,39.739];
		//var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/-104.988,39.739;-104.826,38.852?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
		var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/'+start[0]+','+start[1]+';'+end[0]+','+end[1]+'?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
		// make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
		var req = new XMLHttpRequest();
		req.open('GET', url, true);
		req.onload = function() {
		var json = JSON.parse(req.response);
		var data = json.routes[0];
		var route = data.geometry.coordinates;
		var geojson = {
			type: 'Feature',
			properties: {},
			geometry: {
			type: 'LineString',
			coordinates: route
			}
		};
		// if the route already exists on the map, reset it using setData
		if (map.getSource('route')) {
			map.getSource('route').setData(geojson);
		} else { // otherwise, make a new request
			map.addLayer({
			id: 'route',
			type: 'line',
			source: {
				type: 'geojson',
				data: {
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'LineString',
					coordinates: geojson
				}
				}
			},
			layout: {
				'line-join': 'round',
				'line-cap': 'round'
			},
			paint: {
				'line-color': '#3887be',
				'line-width': 5,
				'line-opacity': 0.75
			}
			});
		}
		// add turn instructions here at the end
		};
		req.send();
	}
	
	map.on('load', function() {
		// make an initial directions request that
		// starts and ends at the same location
		getRoute(start);
	
		// Add starting point to the map
		map.addLayer({
		id: 'point',
		type: 'circle',
		source: {
			type: 'geojson',
			data: {
			type: 'FeatureCollection',
			features: [{
				type: 'Feature',
				properties: {},
				geometry: {
				type: 'Point',
				coordinates: start
				}
			}
			]
			}
		},
		paint: {
			'circle-radius': 10,
			'circle-color': '#3887be'
		}
		});
		// this is where the code from the next step will go
	});
}