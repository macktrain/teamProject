var key = 'PjAiqQkX9ryN0fnzohJ4agvUcOtN2qWVZrKapDidlqWzHbwfW9';
var secret = 'LZWrcUd02uh95dPgaLU7dWSvbPycN2zFXRU7nnWT';
mapboxgl.accessToken = 'pk.eyJ1IjoibGVlbWFjayIsImEiOiJja3BuY2dxaGMxYW9zMnZvMTV6MWkzZWF0In0.XHn1sa4lElD3quhVtUgAYw';
var uspsKey = "03d3b0ff-8a47-97f4-5b11-0dd2fce1677c";
var uspsToken = "P6IxVG04PADHwMBQ6Hci";

var dashboard = document.getElementById("dashboard");
var results = document.getElementById("results");
var petTypeEl = document.getElementById("petType");
var genderEl = document.getElementById("gender");
var access_type = "";
var access_token = "";
var searchHTML = "";
var proceed = 0;

var start = [];

var searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", function() {getUserAddress();checkPets(gender.value, petType.value);hideMapBody();}, false);

var backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", function() {hideMapBody();}, false);

getToken();

/*
function buildPetType ()
{
	fetch('https://api.petfinder.com/v2/types', 
		{
			headers: 
			{
				'Authorization': token_type + ' ' + access_token,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})

	// Return the API response as JSON
	.then(function (resp) 
	{ 
		return resp.json();
	})

	// Log the petData
	.then(function (petTypes) 
	{
		console.log('Pet Types', petTypes);

		var petOption = document.createElement("option")
		petOption.setAttribute.name = "petType";
		petOption.setAttribute.id = "petType";
		petOption.textContent = "Select Pet Type";
		petTypeEl.appendChild(petOption);

		for (var i=0; i< petTypes.types.length; i++)
		{
			var petOption = document.createElement("option")
			petOption.setAttribute.name = "petType";
			petOption.setAttribute.id = "petType";
			petOption.textContent = petTypes.types[i].name;
			petTypeEl.appendChild(petOption);
		}
	})

	// Logs errors in console
	.catch(function (error) 
	{
		console.log('Error:  ', error);
	});
}*/

function checkPets(gender,type,page)
{
	//first thing we do is get the user address
	if (!proceed) {return;}

	if ((gender == "error") || (type == "error"))
	{
		errorModalFunc ("Please be sure to select a valid Gender and Pet type");
		//This stops the function right here
		return;
	}

	var string = 'https://api.petfinder.com/v2/animals?&limit=50&status=adoptable';
	
	if (gender !="Both") {string += ('&gender='+ gender);}
	if (type !="All") {string += ('&type='+ type);}
	
	//The original authentication fetch creates a token that we get to use for the petData calls
	fetch(string, 
	{
		headers: 
		{
			'Authorization': token_type + ' ' + access_token,
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})

	// Return the API response as JSON
	.then(function (resp) 
	{ 
		return resp.json();
	})

	// Log the petData
	.then(function (availPets) 
	{
		console.log('Available Pets', availPets);
		results.innerHTML = "";
		if (availPets.animals == undefined)
		{
			errorModalFunc("No results"); 
			return;
		}
		
		for (var i=0; i < availPets.animals.length; i++)
		{
			if (availPets.animals[i].primary_photo_cropped != null)
			{
				var petDiv = document.createElement("div");
				petDiv.setAttribute("class", "petResult");
				petDiv.setAttribute("id", "petID" + availPets.animals[i].id);
				results.appendChild(petDiv);

				var addrArr =  [availPets.animals[i].contact.address.address1, 
								availPets.animals[i].contact.address.address2,
								availPets.animals[i].contact.address.city,
								availPets.animals[i].contact.address.state,
								availPets.animals[i].contact.address.postcode];

				var addressConcat = "";

				if (availPets.animals[i].contact.address.address1 !== null && 
					!(availPets.animals[i].contact.address.address1.includes("P.O.")))
					{addressConcat += availPets.animals[i].contact.address.address1.replace(" ", "%20") + "%20";}
				if (availPets.animals[i].contact.address.address2 !== null && 
					!((availPets.animals[i].contact.address.address2.includes("P.O."))
					||
					(availPets.animals[i].contact.address.address2.includes("P.O.")))					)
					{addressConcat += availPets.animals[i].contact.address.address2 + "%20";}
				if (availPets.animals[i].contact.address.city !== null)
					{addressConcat += availPets.animals[i].contact.address.city + "%20";}
				if (availPets.animals[i].contact.address.state !== null)
					{addressConcat += availPets.animals[i].contact.address.state + "%20";}
				if (availPets.animals[i].contact.address.postcode !== null)
					{addressConcat += availPets.animals[i].contact.address.postcode;}
					
				if (addressConcat.trim() === "") {addressConcat = "NoAddress";}
								
				var petImg = document.createElement('img');
				petImg.setAttribute("class", "petImg");
				petImg.setAttribute("id", "petImg" + availPets.animals[i].id);
				petImg.setAttribute("src", availPets.animals[i].primary_photo_cropped.small);
				//THIS LINE IS MOST IMPORTANT AND LEADS USER TO THE MAP
				petImg.setAttribute("onClick", "geoCode('"+ addressConcat +"','to')");
				petDiv.appendChild(petImg);


				var petNameDiv = document.createElement("div");
				petNameDiv.setAttribute("class", "petName");
				petNameDiv.innerHTML = availPets.animals[i].name;
				results.appendChild(petNameDiv);

				var petAgeDiv = document.createElement("div");
				petAgeDiv.setAttribute("class", "petAge");
				petAgeDiv.innerHTML = availPets.animals[i].age;
				results.appendChild(petAgeDiv);

				var petAddressDiv = document.createElement("div");
				petAddressDiv.setAttribute("class", "petAddress");
				var postAddr = availPets.animals[i].contact.address.address1 +  " " + 
								availPets.animals[i].contact.address.address2 +  " " +
								availPets.animals[i].contact.address.city +  " " +
								availPets.animals[i].contact.address.state +  " " +
								availPets.animals[i].contact.address.postcode;

				petAddressDiv.innerHTML = postAddr;
				results.appendChild(petAddressDiv);

				var petEmailDiv = document.createElement("div");
				petEmailDiv.setAttribute("class", "petEmail");
				petEmailDiv.innerHTML = availPets.animals[i].contact.email;
				results.appendChild(petEmailDiv);

				var petPhoneDiv = document.createElement("div");
				petPhoneDiv.setAttribute("class", "petPhone");
				petPhoneDiv.innerHTML = availPets.animals[i].contact.phone;
				results.appendChild(petPhoneDiv);
				
			}
		}

	})

	// Logs errors in console
	.catch(function (error) 
	{
		console.log('Error:  ', error);
	});
}

function getToken ()
{
	// Call the API
	// This is a POST request, because we need the API to generate a new token for us
	fetch('https://api.petfinder.com/v2/oauth2/token', 
	{
		method: 'POST',
		body: 'grant_type=client_credentials&client_id=' + key + '&client_secret=' + secret,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
	// Return the authentication token response as JSON
	.then(function (resp) 
	{
		return resp.json();
	})
	// Logs all of the API petData in console
	.then(function (tokenData) 
	{
		console.log('token', tokenData);
		token_type = tokenData.token_type;
		access_token = tokenData.access_token;
		//buildPetType();
	})

	// Logs errors in console
	.catch(function (error) 
	{
		console.log('Error:  ', error);
	});

}

function geoCode (addressString, origin)
{
	addressString = addressString.trim(); 
	addressString = addressString.replace(" ", "%20");
	//https://api.mapbox.com/geocoding/v5/mapbox.places/2%20Lincoln%20Memorial%20Cir%20NW.json?access_token=
	url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+ addressString +".json?access_token=" + mapboxgl.accessToken;
	
	fetch(url, 
	{
		method: 'GET'
	})
	// Return the authentication token response as JSON
	.then(function (resp) 
	{
		return resp.json();
	})
	// Logs all of the API petData in console
	.then(function (locationData) 
	{
		console.log ("LocationData", locationData);
		
		//if the image onclick activated go to the map because now both to and from have been defined
		if (origin === "to") 
		{
			var lon = locationData.features[0].geometry.coordinates[0];
			var lat = locationData.features[0].geometry.coordinates[1];
			getDirections([lon,lat]);
		}
		else 
		{
			//This is for when userAddressDiv details are geocoded
			start[0] = locationData.features[0].geometry.coordinates[0];
			start[1] = locationData.features[0].geometry.coordinates[1];
		}
	})
	// Logs errors in console
	.catch(function (error) 
	{
		console.log('Error:  ', error);
	});
	
}

function getUserAddress()
{
	if (document.getElementById("userAddress1").value.trim() === "") 
	{
		errorModalFunc ("Please enter a street address.");
		return;
	}
	if (document.getElementById("userCity").value.trim() === "") 
	{
		errorModalFunc ("Please enter a city.");
		return;
	}
	if (document.getElementById("userState").value.trim() === "") 
	{
		errorModalFunc ("Please enter a state.");
		return;
	}
	if (document.getElementById("userZip").value.trim() === "") 
	{
		errorModalFunc ("Please enter a zip.");
		return;
	}
	
	var userAdd  = 	document.getElementById("userAddress1").value.trim() + " " +
					document.getElementById("userCity").value.trim() +  " " +
					document.getElementById("userState").value.trim() +  " " +
					document.getElementById("userZip").value.trim();
	
	proceed = 1;
	geoCode (userAdd, 'start');
}

function hideMapBody ()
{
	document.getElementById("mapBody").style.display = "none";
	proceed = 0;
}