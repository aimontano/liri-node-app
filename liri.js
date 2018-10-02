const dotenv = require("dotenv").config();
const keys = require('./keys');
const Spotify = require('node-spotify-api');
const axios = require('axios');
const imdb = require('imdb-api');
const fs = require('fs');

var spotify = new Spotify(keys.spotify);

let action = process.argv[2]; // action input
let input = process.argv[3]; // song, song, movie input

let logString = ""; // variable stores what will be printed/logged to file

const getMovies = movie => {
	imdb.search({
		name: movie
	}, {
		apiKey: keys.omdb.key
	}).then(response => {
		response.results.forEach(item => {
			imdb.get({id: item.imdbid}, {apiKey: keys.omdb.key}).then(result => {
			  // * Title of the movie.
			  let movieTitle = result.title;
			  // * Year the movie came out.
			  let movieYear = result.year;

			 	// if doesn't have the default result.year for year
			  if(!movieYear) {
			  	movieYear = result._year_data;
			  }
			  
			  // * IMDB Rating of the movie.
			  let imdbRating = "Not available"; // set to no rating

			  // * Rotten Tomatoes Rating of the movie.
			  let rottenTomatoes = "Not available"; // set to no rating

			  // check if the movies has any ratings 
			  if(result.ratings) {
			  	result.ratings.forEach(item => {
			  		if(item.Source === "Internet Movie Database")
			  			imdbRating = item.Value;
			  		
			  		if(item.Sourse === "Rotten Tomatoes")
			  			rottenTomatoes = item.Value;
			  	});
			  }

			  // * Country where the movie was produced.
			  let countryProd = result.country;
			  // * Language of the movie.
			  let languages = result.languages;
			  // * Plot of the movie.
			  let plot = result.plot;

			  if(plot == 'N/A')
			  	plot = "Not available";

			  // * Actors in the movie.
			  let actors = result.actors;

			  logString = "--> Movie title: " + movieTitle + "\n";
			  logString += "--> Movie released year: " + movieYear + "\n";
			  logString += "--> IMDB Ratings: " + imdbRating + "\n";
			  logString += "--> Rotten Tomatoes Rating: " + rottenTomatoes + "\n";
			  logString += "--> Country produced: " + countryProd + "\n";
			  logString += "--> Movie language(s): " + languages + "\n";
			  logString += "--> Movie plot: " + plot + "\n";
			  logString += "--> Movie Actors: " + actors + "\n";

			  console.log("\n*******************************************************");
			  console.log(logString);

			}).catch(console.log);

		});

	}).catch(console.log);
}
// Funcion logs name, location, time 
const getVenueInfo = artist => {
	let searchQuery = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";

	axios.get(searchQuery).then(response => {
		let venues = [];

		for(let i = 0; i < response.data.length; i++) {
			console.log("\n***************************************")
			console.log("Result #" + (i + 1))
			console.log("Venue Information:")
			console.log("--> name: " + response.data[i].venue.name);
			console.log("--> location: " + response.data[i].venue.city + ", " + response.data[i].venue.region);
			console.log("--> time: " + response.data[i].datetime);
		}
	});
}

// functions takes a song string
// logs - artist name, song name, preview link
const getSpotifySong = song => {
	spotify.search({
		type: "track",
		query: song,
		limit: 10
	}, (err, data) => {
		if(err)
			console.log(err)

		for(let i = 0; i < data.tracks.items.length; i++){

			let artists = data.tracks.items[i].album.artists[0].name
			let songName = data.tracks.items[i].album.name;
			let preview = data.tracks.items[i].preview_url;
			console.log("\n*************************************");
			console.log("Result: #" +  (i + 1));
			console.log("--> Artist: " + artists);
			console.log("--> Song name: " + songName);
			console.log("--> Preview url: " + preview);

			// let logString = artists + "\n" + songName + "\n" + preview + "\n";
			let logString = "--> Artist: " + artists + "\n";
					logString += "--> Song name: " + songName  + "\n";
					logString += "--> Preview URL: " + preview + "\n";

			appendLog(action, song, logString);
		}
	});
}

// do-what-it-says
const doWhatItSays = () => {
	fs.readFile('random.txt', 'utf8', (err, data) => {
		if(err)
			console.log(err)

		let song = data.split(',')[1]
		getSpotifySong(song);
	});
}

// append to file
const appendLog = (command, input, data) => {
	let logCommand = "Command: " + command;
	let logInput = "Input: " + input;
	let logData = "Data: \n" + data;

	logString = "**********************************\n";
			logString += logCommand + "\n" + logInput + "\n" + logData;

	fs.appendFile('log.txt', logString, err => {
		if(err) 
			console.log("error");
		else 
			console.log("Content Added!");
	})
}


switch (action) {
	case "spotify-this-song":
		getSpotifySong(input);
		break;
	case "concert-this":
		getVenueInfo(input);
		break;
	case 'movie-this':
		getMovies(input);
		break;
	case 'do-what-it-says':
		doWhatItSays();
		break;
}