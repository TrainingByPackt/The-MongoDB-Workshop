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
// mongo "mongodb+srv://myAtlasCluster-fawxo.gcp.mongodb.net/sample_mflix" --username $USERNAME --password $PASSWORD .\Excercise_1_Code.js

//// TOPIC A: "Aggregate is the new Find"
// Excercise 1: Introduction to Simple Aggregations.
var findTopRomanceMovies = function() {
    print("Finding top Classic Romance Movies...");
    var pipeline = [
        { $match: {
            genres: {$in: ["Romance"]}, // Romance movies only.
            released: {$lte: new ISODate("2010-01-01T00:00:00Z") }}},
        { $sort:  {"imdb.rating": -1}}, // Sort by IMDB rating.
        { $limit: 5 },                 // Limit to 5 results.
        { $project: { title: 1, genres: 1, released: 1, "imdb.rating": 1}}
    ];
    db.movies.aggregate(pipeline).forEach(printjson);
}
findTopRomanceMovies();