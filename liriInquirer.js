const liri = require('./liriFunctions.js');
const inquirer = require("inquirer");

// create a functions that allows to get user information
const getInfo = type => {
	inquirer.prompt([
		{
			type: 'input',
			name: 'search',
			message: "What " + type + " would you like to search?"
		}
	]).then(response => {
		let search = response.search;
		switch (type) {
			case 'song':
				liri.getSpotifySong(search);
				break;
			case 'band/artist':
				liri.getVenueInfo(search);
				break;
			case 'movie':
				liri.getMovies(search);
				break;
		}
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
				getInfo('song');
				break;
			case 'Search for movie information':
				console.log("Getting movie information...");
				getInfo('movie')
				break;
			case 'Search for bands in town':
				console.log("Searching for band...");
				getInfo('band/artist');
				break;
		}

	})
}

module.exports = {
	getUserRequest
}