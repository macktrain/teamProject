var key = 'PjAiqQkX9ryN0fnzohJ4agvUcOtN2qWVZrKapDidlqWzHbwfW9';
var secret = 'LZWrcUd02uh95dPgaLU7dWSvbPycN2zFXRU7nnWT';
var petTypeEl = document.getElementById("petType");
var genderEl = document.getElementById("gender");
var access_type = "";
var access_token = "";

var searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", function() {checkPets(gender.value, petType.value);}, false);

getToken();

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
}

function checkPets(gender,type,page)
{
	var string = 'https://api.petfinder.com/v2/animals?status=' + status;
	if (gender!="both") {string += ('&gender='+ gender);}
	if (type!="all") {string += ('&type='+ type);}
	
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
		//GO TO RESULTS
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
	.then(function (petData) 
	{
		console.log('token', petData);
		token_type = petData.token_type;
		access_token = petData.access_token;
		buildPetType();
	})

	// Logs errors in console
	.catch(function (error) 
	{
		console.log('Error:  ', error);
	});

}
