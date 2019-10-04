/*
* Michael Harrison.
* 04/10/2019
*
* Packt MongoDB For Begginers.
* Chapter 8
*/

// Excercise code for Packt MongoDB For Begginers.
// Includes the final code snippets for each of the excercises completed in Chapter 8
// This code can be run directly against the MongoDB Shell in interactive mode, or
// Can be run as a file like below:
// mongo "mongodb+srv://myAtlasCluster-fawxo.gcp.mongodb.net/sample_mflix" --username $USERNAME --password $PASSWORD .\Excercise_Code.js

////// CHAPTER 8: AGGREGATION.
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

//// TOPIC B: Manipulating Data
// Excercise 1: Manipulating Data (Part 1)
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

// Excercise 2: Manipulating Data (Part 2)
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

//// TOPIC C: Working with large data sets.
// Excercise 1: Working with large data sets.
var findMostCommentedMovies = function() {
    print("Finding the most commented on movies.");
    var pipeline = [
             { $sample: {size: 5000}}, 
             { $group: {
                 _id: "$movie_id",
                 "sumComments": { $sum: 1}
             }},
             { $sort: { "sumComments": -1}},
             { $limit: 5},
             { $lookup: {
                 from: "movies",
                 localField: "_id",
                 foreignField: "_id",
                 as: "movie"
             }},
             { $unwind: "$movie" },
             { $project: {
                 "movie.title": 1,
                 "movie.imdb.rating": 1,
                 "sumComments": 1,
             }},
             { $merge: {
                 into: "most_commented_movies",
                 on: "_id",
                 whenMatched: "replace",
                 whenNotMatched: "insert"
             }}
    ];
    db.comments.aggregate(pipeline).forEach(printjson);
}
findMostCommentedMovies();

//// TOPIC D: Getting the most from your aggregations
// Excercise 1: Getting the most from your aggregations
var findAwardWinningDocumentaries = function() {
    print("Finding award winning documentary Movies...");
    var pipeline = [
        { $match: {
            "awards.wins": { $gte: 1},
            genres: {$in: ["Documentary"]},
        }},
        { $sort:  {"awards.wins": -1}}, // Sort by award wins.
        { $limit: 3},
        { $project: { title: 1, genres: 1, awards: 1}},
    ];
    
    var options ={
        maxTimeMS: 30000,
        allowDiskUse: true,
        comment: "Find Award Winning Documentary Films"
    }
    db.movies.aggregate(pipeline, options).forEach(printjson);
}
findAwardWinningDocumentaries();




