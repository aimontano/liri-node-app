const dotenv = require("dotenv").config();
const keys = require('./keys');
const Spotify = require('node-spotify-api');
const axios = require('axios');

var spotify = new Spotify(keys.spotify);

let action = process.argv[2];
let input = process.argv[3];

let artist = input;

const getVenueInfo = artist => {
	let searchQuery = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

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
		limit: 20
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



switch (action) {
	case "spotify-this-song":
		getSpotifySong(input);
		break;
	case "concert-this":
		getVenueInfo(input);
		break;
}