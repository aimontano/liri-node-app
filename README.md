# Liri Node App

This node app allows you to search for the following: 
- Songs on spotify
- Bands in town
- Movies 

### Set up
If you don't have node installed on your local computer visit [Nodejs.org](https://nodejs.org/en/) and install it

Download through git
```
git clone https://github.com/aimontano/liri-node-app.git
```
Enter folder

```
cd liri-node-app
```
Install node module dependencies 
```
npm i 
```
Next, you will need to get a [Spotify API Key](https://developer.spotify.com/) and [OMDB API](http://www.omdbapi.com/) key to run the program successfully.

Next create a new file called `.env` and add you API Keys without any quotes
```
# API Keys
SPOTIFY_ID=your_spotify_id
SPOTIFY_SECRET=your_spotify_secret
OMDB_KEY=your_omdb_key
```


#### Search Spotify

To search songs on spotify type the following command. The song name must be enclosed in quotes.
```
node liri.js spotify-this-song "Song name"
```

#### Search Bands in Town
Band or artist must be enclosed in quotes
```
node liri.js concert-this "band/artist"
```

#### Seach Movies 
Movie name must be enclosed in quotes
```
node liri.js movie-this "movie name"
```