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
				break;
			case 'Search for bands in town':
				console.log("Searching for band...");
				break;
		}

	})
}

module.exports = {
	getUserRequest
}