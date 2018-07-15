# liri-node-app
This project has the following commands that execute a certain way
    * `my-tweets` - Shows your last 20 tweets
    * `spotify-this-song` - Shows the following information about the given song 
        * Artist(s)     
        * The song's name
        * A preview link of the song from Spotify
        * The album that the song is from
    * `movie-this` - Shows the following information about the given movie 
        * Title of the movie.
        * Year the movie came out.
        * IMDB Rating of the movie.
        * Rotten Tomatoes Rating of the movie.
        * Country where the movie was produced.
        * Language of the movie.
        * Plot of the movie.
        * Actors in the movie.
    * `do-what-it-says` - Decides which command will it execute

Example Usage of each command:
    node liri.js my-tweets
    node liri.js spotify-this-song
    node liri.js spotify-this-song Just the Way You Are
    node liri.js spotify-this-song "Just the Way You Are"
    node liri.js movie-this
    node liri.js movie-this Crouching Tiger, Hidden Dragon
    node liri.js movie-this "Crouching Tiger, Hidden Dragon"
    node liri.js do-what-it-says