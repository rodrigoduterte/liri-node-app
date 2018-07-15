require("dotenv").config();
var keys = require('./js/keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment');
const fs = require('fs');

var twitter =  new Twitter(keys.twitter);
var spotify =  new Spotify(keys.spotify);
var omdbKey = keys.omdb.key;

var command = process.argv[2];
var keyword;

var arr;
var random;


var liri = {
    "my-tweets": function () {
        // * This will show your last 20 tweets and when they were created at in your terminal/bash window.
        // long version
        // https://api.twitter.com/1.1/statuses/user_timeline.json
        // short version
        // statuses/user_timeline
        twitter.get('statuses/user_timeline', {screen_name: 'gabrielferrer'}, function(error, tweets, response) {
            console.log('Tweets of User: gabrielferrer');
            tweets.forEach(e => {
                console.log("{Tweet: " + e.text + " | Date Tweeted: " + moment(e.created_at,'ddd MMM DD HH:mm:ss Z YYYY').format('MMMM DD YYYY') + "}");
            });
        });
        fs.appendFileSync('./txt/log.txt', command + '\n')
    },
    "spotify-this-song": function (song) {
        // * This will show the following information about the song in your terminal/bash window
        // * Artist(s)
        // * The song's name
        // * A preview link of the song from Spotify
        // * The album that the song is from
        // * If no song is provided then your program will default to "The Sign" by Ace of Base.
        spotify.search({type: 'track', query: song},function(err,data){
                var firstItem = data.tracks.items[0];
                if (err) {
                    console.log('Song not found!');
                    console.log('Error occurred: ' + err);
                } else {
                    firstItem.artists.forEach(element => {
                        (firstItem.artists.length === 1) ? console.log('Artist: ' + element.name) : console.log('Artists: ' + element.name);
                    });
                    console.log('Song Name: ' + firstItem.name);
                    console.log('Preview Link: ' + firstItem.external_urls.spotify);
                    console.log('Album: ' + firstItem.album.name);
                    fs.appendFileSync('./txt/log.txt','spotify-this-song "' + firstItem.name +'"\n');
                }
            })
            
    },
    "movie-this": function (movie) {
        //     * Title of the movie.
        //    * Year the movie came out.
        //    * IMDB Rating of the movie.
        //    * Rotten Tomatoes Rating of the movie.
        //    * Country where the movie was produced.
        //    * Language of the movie.
        //    * Plot of the movie.
        //    * Actors in the movie.
        //  * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
        //  * If you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>
        function displayMovie(body) {
            console.log('Title of the Movie: ' + JSON.parse(body).Title);
            console.log('Year the movie came out: ' + JSON.parse(body).Released.substr(-4, 4));
            console.log('IMDB Rating of the movie: ' + JSON.parse(body).imdbRating);
            JSON.parse(body).Ratings.forEach(e => {
                if (e.Source === "Rotten Tomatoes") {
                    console.log('Rotten Tomatoes Rating: ' + e.Value);
                }
            });
            console.log('Countries filmed: ' + JSON.parse(body).Country);
            console.log('Language used: ' + JSON.parse(body).Language);
            console.log('Plot: ' + JSON.parse(body).Plot);
            console.log('Actors: ' + JSON.parse(body).Actors);
        }
        if (movie === undefined) {
            request("http://www.omdbapi.com/?t=Mr.+Nobody&apikey="+omdbKey, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    displayMovie(body);
                    fs.appendFileSync('./txt/log.txt','movie-this ' + '"Mr. Nobody"'+'\n');
                } else {console.log('Movie not found!');}
            });
        } else {
            request("http://www.omdbapi.com/?t=" + movie +"&apikey=" + omdbKey, function(error, response, body) {
                movie = movie.replace(/\+/g,' ');
                if (!error && response.statusCode === 200) {
                    displayMovie(body);
                    fs.appendFileSync('./txt/log.txt','movie-this "' + JSON.parse(body).Title +'"\n');
                } else {console.log('Movie not found!');}
            });
        }
    },
    "do-what-it-says": function () {
        fs.readFile('./txt/random.txt','utf-8',function (error,data) {
            arr = data.split('\n');
            random = Math.floor(Math.random() * arr.length);
            var lineitem = arr[random].split(' "');
            liri[lineitem[0]](lineitem[1].replace(/\"/g,'')); 
        });
    }
}
if ((keyword === undefined || keyword === "") && process.argv[3] === undefined) {
    if (command === 'spotify-this-song') {
        keyword = 'The Sign(US Album)[Remastered]';
        liri['spotify-this-song'](keyword);
    } else if (command === 'movie-this') {
        liri['movie-this'](keyword);
    } else if (command === 'do-what-it-says') {
        liri['do-what-it-says']();
    } else if (command === 'my-tweets') {
        liri[command]();
    }
} else {
    if (command === 'movie-this') {
        process.argv.forEach((element,index,array) => {
            index > 3 ? keyword += "+" + process.argv[index] : keyword = array[3];
        });
    }
    if (command === 'spotify-this-song') {
        keyword = process.argv.slice(3).join(",").replace(/,/g," ");
    }
    liri[command](keyword);
}