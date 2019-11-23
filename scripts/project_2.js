const locations = [];

L.mapbox.accessToken = 'pk.eyJ1Ijoic3JpamFuMTIxNCIsImEiOiJjazMyazBkbDAwZGIxM21sYjF6NnVqbnAxIn0.jtPTRywpGF6mJ2ZRbtWJmw';
const mymap = L.map('map_id').setView([40, -100], 3);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 13,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1Ijoic3JpamFuMTIxNCIsImEiOiJjazMyazBkbDAwZGIxM21sYjF6NnVqbnAxIn0.jtPTRywpGF6mJ2ZRbtWJmw'
}).addTo(mymap);

function BinarySearch2dArray(x, arr) {
	let start = 0, end = arr.length - 1;
	// Iterate while start not meets end
	while (start <= end) {
		// Find the mid index
		let mid = Math.floor((start + end) / 2);
		// If element is present at mid, return True
		if (arr[mid][0] === x[0]) return mid;
		// Else look in left or right half accordingly
		else if (arr[mid][0] < x[0])
			start = mid + 1;
		else
			end = mid - 1;
	}
	return -1;
}

function add_To_Sorted_Array(element, arr) {
	if (arr.length == 0) {
		arr.push(element);
		return;
	}

	//Avoid Duplicate Latitude longitude co-ordinates
	let index = BinarySearch2dArray(element[0], arr);
	if (index != -1 && (arr[index][1] == element[1])) {
		return;
	}
	arr.push(element);

	for (let i = arr.length - 1; i > 0; i--) {
		let temp2 = (arr[i])[0];
		if (((arr[i])[0]) < ((arr[i - 1])[0])) {
			let temp = arr[i];
			arr[i] = arr[i - 1];
			arr[i - 1] = temp;
		} else {
			break;
		}
	}
	return;
}

$("#button_id").on('click', function () {

	//Make the err bar hidden if it is already visible.
	$("#err_msg_id").css("visibility", "hidden");

	const addMarkerAndPopup=(latlng)=>{
		//Add Marker to the location and fly there.
		//Also add pop up to the marker.
		//Only "latlng" is valid.
		if(latlng) {	//"latlng" will be undefined if the geocoding fails.
			let marker = L.marker(latlng);

			if(BinarySearch2dArray(latlng,locations)==-1) {	//Only add a new marker if a marker doesn't exists
				marker=marker.addTo(mymap);
				marker.bindPopup("<p>"+$("#input_id").val()+"</p>");	//add user input text to pop up.
			}
			mymap.flyTo(latlng, 4);
		}
	}

	//Function to add queried location to side bar.
	//Called by the geocoder object
	const add_Location_To_Side_bar = (err, data) => {
		if (err) {
			return console.error('error');
		}
		if (data.latlng) {
			$("#side_box_id").append("<p>" +
				$("#input_id").val() +
				"<br>[Latitude,Longitude] : " + data.latlng
				+ "</p>");

			addMarkerAndPopup(data.latlng);

			add_To_Sorted_Array(data.latlng, locations);	//List of all marked locations

		} else {
			$("#err_msg_id").css("visibility", "visible");
		}
	}


	//geocode the user input location
	const geocoder = L.mapbox.geocoder('mapbox.places');
	geocoder.query($("#input_id").val(), add_Location_To_Side_bar);
});