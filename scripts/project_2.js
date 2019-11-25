
//Utility function to binary search the first array cloumn of a 2d array sorted according to the first column.
//O(Log(n))
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

//Utility function to add an element to a sorted array.
//O(n)
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

//Create a 2d locations Array to store previous LatLng.
const locations = [];

//Create Map from Mapbox and LeafJs
L.mapbox.accessToken = 'pk.eyJ1Ijoic3JpamFuMTIxNCIsImEiOiJjazMyazBkbDAwZGIxM21sYjF6NnVqbnAxIn0.jtPTRywpGF6mJ2ZRbtWJmw';
const mymap = L.map('map_id').setView([40, -100], 3);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 20,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1Ijoic3JpamFuMTIxNCIsImEiOiJjazMyazBkbDAwZGIxM21sYjF6NnVqbnAxIn0.jtPTRywpGF6mJ2ZRbtWJmw'
}).addTo(mymap);

///handle when user presses the "ENTER" key on text box.
$("#input_id").on("keydown",function(event){
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
	  // Cancel the default action, if needed
	  event.preventDefault();
	  // Trigger the button element with a click
	  $("#button_id").click();
	}
})


///The form button click handler.
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
				marker.bindPopup("<p class='emphasis'>"+($("#input_id").val()).toUpperCase()+"</p>");	//add user input text to pop up.
			}
			mymap.flyTo(latlng, 8);
		}
	}

	//Function to add queried location to side bar.
	//Called by the geocoder object
	const add_Location_To_Side_bar = (err, data) => {
		if (err) {
			return console.error('error');
		}
		if (data.latlng) {
			$("#records_id").append("<p class='data_id italics' >" +
				$("#input_id").val().toUpperCase() +
				":  " + data.latlng
				+ "</p>");

			addMarkerAndPopup(data.latlng);

			add_To_Sorted_Array(data.latlng, locations);	//List of all marked locations

		} else {
			//Make Error Message visible
			$("#err_msg_id").css("visibility", "visible");
		}
	}

	//geocode the user input location
	const geocoder = L.mapbox.geocoder('mapbox.places');
	geocoder.query($("#input_id").val(), add_Location_To_Side_bar);
});

///------The code below adds a dragability to the Box in the Map------
dragElement($("#text_area_id").get(0));
function dragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	if (document.getElementById(elmnt.id + "_touchable_id")) {
	  // if present, the header is where you move the DIV from:
	  document.getElementById(elmnt.id + "_touchable_id").onmousedown = dragMouseDown;
	} else {
	  // otherwise, move the DIV from anywhere inside the DIV:
	  elmnt.onmousedown = dragMouseDown;
	}
	function dragMouseDown(e) {
	  e = e || window.event;
	  e.preventDefault();
	  // get the mouse cursor position at startup:
	  pos3 = e.clientX;
	  pos4 = e.clientY;
	  document.onmouseup = closeDragElement;
	  // call a function whenever the cursor moves:
	  document.onmousemove = elementDrag;
	}
  
	function elementDrag(e) {
	  e = e || window.event;
	  e.preventDefault();
	  // calculate the new cursor position:
	  pos1 = pos3 - e.clientX;
	  pos2 = pos4 - e.clientY;
	  pos3 = e.clientX;
	  pos4 = e.clientY;
	  // set the element's new position:
	  elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	  elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}
	function closeDragElement() {
	  // stop moving when mouse button is released:
	  document.onmouseup = null;
	  document.onmousemove = null;
	}
}