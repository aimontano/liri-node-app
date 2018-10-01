const dotenv = require("dotenv").config();
const keys = require('./keys');
const Spotify = require('node-spotify-api');
const axios = require('axios');
const imdb = require('imdb-api');
const fs = require('fs');

var spotify = new Spotify(keys.spotify);

let action = process.argv[2]; // action input
let input = process.argv[3]; // song, song, movie input

const getMovies = movie => {
	imdb.search({
		name: movie
	}, {
		apiKey: keys.omdb.key
	}).then(response => {
		response.results.forEach(item => {

			imdb.get({id: item.imdbid}, {apiKey: keys.omdb.key}).then(result => {
				console.log("\n*******************************************************")

			  // * Title of the movie.
			  console.log("--> Movie title: " + result.title);
			  // * Year the movie came out.
			  if(result.year)
			  	console.log("--> Movie released year: " + result.year);
			  else
			  	console.log("--> Movie released year: " + result._year_data);
			  // * IMDB Rating of the movie.
			  if(result.ratings) {
			  	result.ratings.forEach(item => {
			  		if(item.Source === "Internet Movie Database")
			  			console.log("--> IMDB Ratings: " + item.Value);
			  		else 
			  			console.log("--> No IMDB Ratings");
			  		// * Rotten Tomatoes Rating of the movie.
			  		if(item.Sourse === "Rotten Tomatoes")
			  			console.log("--> Rotten Tomatoes Rating: " + item.Value);
			  		else 
			  			console.log("--> No Rotten Tomatoes Ratings");
			  	});
			  }
			  
			  // * Country where the movie was produced.
			  console.log("--> Country produced: " + result.country);

			  // * Language of the movie.
			  console.log("--> Movie language(s): " + result.languages);

			  // * Plot of the movie.
			  console.log("--> Movie plot: " + result.plot);

			  // * Actors in the movie.
			  console.log("--> Movie Actors: " + result.actors);
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
			console.log("\n*************************************")
			console.log("Result: #" +  (i + 1));
			console.log("--> Artist: " + artists);
			console.log("--> Song name: " + songName);
			console.log("--> Preview url: " + preview);
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