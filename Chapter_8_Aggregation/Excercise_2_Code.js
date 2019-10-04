/*
* Michael Harrison.
* 04/10/2019
*
* Packt MongoDB For Begginers.
* Chapter 8
*/

// Excercise code for Packt MongoDB For Begginers.
// This code can be run directly against the MongoDB Shell in interactive mode, or
// Can be run as a file like below:
// mongo "mongodb+srv://myAtlasCluster-fawxo.gcp.mongodb.net/sample_mflix" --username $USERNAME --password $PASSWORD .\Excercise_2_Code.js

//// TOPIC B: Manipulating Data
// Excercise Part 1: Manipulating Data
var findGenrePopularity = function() {
    print("Finding popularity of each genre");
    var pipeline = [
       { $match: {
        released: {$lte: new ISODate("2001-01-01T00:00:00Z") }}},
       { $group: {
           _id: {"$arrayElemAt": ["$genres", 0]},
           "popularity": {  $avg: "$imdb.rating"},
           "top_movie": { $max: "$imdb.rating"},
           "longest_runtime": { $max: "$runtime"}
       }},
       { $sort: { popularity: -1}},
       { $project: {
            _id: 1,
             popularity: 1, 
             top_movie: 1, 
             adjusted_runtime: { $add: [ "$longest_runtime", 12 ] } } }
    ];
    db.movies.aggregate(pipeline).forEach(printjson);
}
findGenrePopularity();


// Excercise Part 2: Manipulating Data
var findGenrePopularity = function() {
    print("Finding popularity of each genre");
    var pipeline = [
       { $match: {
        released: {$lte: new ISODate("2001-01-01T00:00:00Z") },
        runtime:  {$lte: 218},
        "imdb.rating": {$gte: 7.0}
        }
       },
       { $sort: {"imdb.rating": -1}},
       { $group: {
         _id: {"$arrayElemAt": ["$genres", 0]},
         "recommended_title": {$first: "$title"},
         "recommended_rating": {$first: "$imdb.rating"},
         "recommended_raw_runtime": {$first: "$runtime"},
         "popularity": {  $avg: "$imdb.rating"},
         "top_movie": { $max: "$imdb.rating"},
         "longest_runtime": { $max: "$runtime"}
       }},
       { $sort: { popularity: -1}},
       { $project: {
            _id: 1,
             popularity: 1, 
             top_movie: 1, 
             recommended_title: 1,
             recommended_rating: 1,
             recommended_raw_runtime: 1,
             adjusted_runtime: { $add: [ "$longest_runtime", 12 ] } } }
    ];
    db.movies.aggregate(pipeline).forEach(printjson);
}
findGenrePopularity();
