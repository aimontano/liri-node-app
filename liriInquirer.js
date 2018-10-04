const liri = require('./liriFunctions.js');
const inquirer = require("inquirer");

const getSong = () => {
	inquirer.prompt([
		{
			type: 'input',
			name: 'song',
			message: "What song would you like to search?"
		}
	]).then(response => {
		let song = response.song;
		liri.getSpotifySong(song);
	})
}

const getMovie = () => {
	inquirer.prompt([
		{
			type: 'input',
			name: 'movie',
			message: "What movie would you like to search?"
		}
	]).then(response => {
		let movie = response.movie;
		liri.getMovies(movie);
	})
}

const getVenue = () => {
	inquirer.prompt([
		{
			type: 'input',
			name: 'venue',
			message: "What band/artist would you like to search?"
		}
	]).then(response => {
		let venue = response.movie;
		liri.getVenueInfo(venue);
	})
}

const getUserRequest = () => {
	inquirer.prompt([
		{
			type: 'list',
			name: 'command',
			message: "What would you like do do?",
			choices: [
				'Search for movie information',
				'Search a song in Spotify',
				'Search for bands in town'
			]
		}	
	]).then(answers => {
		let command = answers.command;
		
		switch (command) {
			case 'Search a song in Spotify':
				console.log("You will search a song in Spotify");
				getSong();
				break;
			case 'Search for movie information':
				console.log("Getting movie information...");
				getMovie();
				break;
			case 'Search for bands in town':
				console.log("Searching for band...");
				getVenue();
				break;
		}

	})
}

module.exports = {
	getUserRequest
}