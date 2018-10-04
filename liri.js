const liri = require('./liriFunctions.js'); // import all the functions 

let action = process.argv[2]; // action input
let input = process.argv[3]; // song, song, movie input

// check what action user wants 
switch (action) {
	case "spotify-this-song":
		liri.getSpotifySong(input);
		break;
	case "concert-this":
		liri.getVenueInfo(input);
		break;
	case 'movie-this':
		liri.getMovies(input)
		break;
	case 'do-what-it-says':
		liri.doWhatItSays();
		break;
	case 'help':
		liri.displayCommands();
		break;
	default:
		console.log("You must enter a valid command. To see valid commands type (node liri.js help)");
		break;
}