const dotenv = require("dotenv").config();
const keys = require('./keys');
const Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

let action = process.argv[2];
let input = process.argv[3];

let artist = input;
let searchQuery = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

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
			console.log("*************************************")
			console.log("Result: #" +  (i + 1));
			console.log("Artist: " + artists);
			console.log("Song name: " + songName);
			console.log("Preview url: " + preview);
		}
	});
}



switch (action) {
	case "spotify-this-song":
		getSpotifySong(input);
		break;
}