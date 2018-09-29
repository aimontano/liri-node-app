const dotenv = require("dotenv").config();
const keys = require('./keys');
const Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

spotify.search({
	type: "track",
	query: "You Say",
	limit: 2
}, (err, data) => {
	if(err)
		console.log(err)

	let artists = data.tracks.items[0].album.artists[0].name

	console.log(artists);
})
