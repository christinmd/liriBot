var axios = require("axios");
var fs = require("fs");
require("dotenv").config();

var inquirer = require('inquirer');

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var search;

inquirer.prompt([
    {
        type: "list",
        message:"choose a command:",
        choices:["concert-this", "song"],
        name:"search"
    },

    {
        type: "input",
        message: "what do you want to search for?",
        name: "term"
    }
   
]).then(function(response){
    search = response.search;

    var concertSearch = new Concert();

    if(search === "concert-this") {
        //console.log("concerts are being searched");
        concertSearch.findConcert(response.term);
    } else if (search === "song"){
        //console.log("concerts are being searched");
        concertSearch.findSong(response.term);
    }

});



// Create the Concert Bands in Town constructor
var Concert = function() {
  // divider will be used as a spacer between the tv data we print in log.txt
  var divider = "\n------------------------------------------------------------\n\n";

  // findShow takes in the name of a tv show and searches the tvmaze API
  this.findConcert = function(artist) {
    var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(URL).then(function(response) {
      // Place the response.data into a variable, jsonData.
      var jsonData = response.data;

      // showData ends up being the string containing the show data we will print to the console
      var showData = []
        for (let i = 0; i < response.data.length; i++) {
            var thisConcert =  "Name of Venue " + jsonData[i].venue.name + "," + "Location" + jsonData[i].venue.country + "," + jsonData[i].venue.city + "Date of Event" + jsonData[i].datetime

            showData.push(thisConcert)
        }
      
        console.log(showData.join("\n\n"));
       

      // Append showData and the divider to log.txt, print showData to the console
      fs.appendFile("log.txt", showData + divider, function(err) {
        if (err) throw err;
        console.log(showData);
      });
    });
  };

  // findSong takes in the name of a song to search for
  this.findSong = function(song) {

    spotify.search({ type: 'track', query: song })
    .then(function(Spotifyresponse) {
        var spotifyData = Spotifyresponse.tracks.items[0].artists[0].name;

        console.log(spotifyData);

         // Append actorData and the divider to log.txt, print showData to the console
      fs.appendFile("log.txt", spotifyData + divider, function(err) {
        if (err) throw err;
        console.log(spotifyData);
      });

  })
  .catch(function(err) {
    console.log(err);
  });
   
    
  };
};

// module.exports = TV;
