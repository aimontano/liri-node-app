const imdb = require('imdb-api');
const dotenv = require("dotenv").config();
const keys = require('./keys');
const Spotify = require('node-spotify-api');
const axios = require('axios');
const fs = require('fs');
const moment = require('moment');

var spotify = new Spotify(keys.spotify);

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

			  if(plot == 'N/A') // if no rating 
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

			  appendLog("movie-this", movie, logString);

			}).catch(e => console.log(e.message));

		});

	}).catch(e => console.log(e.message));
}

// Funcion logs name, location, time 
const getVenueInfo = artist => {
	let searchQuery = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

	axios.get(searchQuery).then(response => {
		// If results
		if(response.data.length > 0) {
			// loops through each result 
			for(let i = 0; i < response.data.length; i++) {
				let name = response.data[i].venue.name; // venue name
				let city = response.data[i].venue.city; // city
				let country = response.data[i].venue.country; // country
				let region = response.data[i].venue.region; // region
				let time = response.data[i].datetime; // time
				// converts time to format -> Day name, Month, day of month, hour:minute am/pm
				let date = moment(time).format("dddd MMM Do, h:mm a"); 

				if(!region) // if region/state not available
					region = "Not available";

				logString = "Venue Information:" + "\n";
				logString += "--> name: " + name + "\n"; 
				logString += "--> city: " + city + "\n";
				logString += "--> country: " + country + "\n";
				logString += "--> region: " + region + "\n";
				logString += "--> date: " + date + "\n";

				console.log("\n***************************************")
				console.log("Result #" + (i + 1))
				console.log(logString);

				appendLog("concert-this", artist, logString);
			}
		} else { // otherwise
			console.log("No Results");
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

	logString = "\n**********************************\n";
	logString += logCommand + "\n" + logInput + "\n" + logData;

	fs.appendFile('log.txt', logString, err => {
		if(err) 
			console.log("error");
	})
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

		if(data.tracks.items.length > 0) {
			// loop through each result
			for(let i = 0; i < data.tracks.items.length; i++){
				let artists = data.tracks.items[i].album.artists[0].name // get artist name
				let songName = data.tracks.items[i].name; // song name
				let preview = data.tracks.items[i].preview_url; // preview url

				if(!preview) // if no preview url
					preview = "Not available";

				logString = "--> Artist: " + artists + "\n";
				logString += "--> Song name: " + songName  + "\n";
				logString += "--> Preview URL: " + preview + "\n";

				console.log("\n*************************************");
				console.log("Result: #" +  (i + 1));
				console.log(logString);

				appendLog("spotify-this-song", song, logString);
			}
		} else {
			console.log("No songs found!");
		}
	});
}

const displayCommands = () => {
	logString ="********************************\n";
	logString +="Commands available: \n";
	logString +="--> spotify-this-song\n";
	logString +="--> concert-this\n";
	logString +="--> movie-this\n";
	logString +="********************************\n";
	logString +="To use the commands you must type the following:\n";
	logString +="node liri.js <command> 'artist/song/movie'\n";
	logString +="********************************";

	console.log(logString);
	appendLog("help", "Not Applicable", logString);
}

module.exports = {
	getSpotifySong,
	getMovies,
	doWhatItSays,
	getVenueInfo,
	displayCommands
}